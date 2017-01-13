'use strict';
const RunKitTask = require('runkit-task');
const tinylr = require('tiny-lr');
const debounce = require('lodash.debounce');

class LiveReloadTask extends RunKitTask {
  execute(done) {
    if (!this.server) {
      const port = this.options.port || 35729;
      this.server = tinylr({ port });
      this.server.server.on('error', (err) => {
        this.log(['error'], err);
      });
      this.server.listen(port, (err) => {
        if (err) {
          return done(err);
        }
        this.log(`Live reload server started on port ${port}`);
        this.changed();
        done();
      });
      return;
    }
    this.changed();
    done();
  }

  changed() {
    const delay = this.options.delay || 500;
    debounce(() => {
      this.log('Triggering LiveReload change');
      this.server.changed({ body: { files: ['*'] } });
    }, delay)();
  }
}

module.exports = LiveReloadTask;
