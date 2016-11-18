'use strict';
const ClientKitTask = require('clientkit-task');
const tinylr = require('tiny-lr');
const debounce = require('lodash.debounce');

class LiveReloadTask extends ClientKitTask {
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
    debounce(() => {
      this.log('Triggering LiveReload change');
      this.server.changed({ body: { files: ['*'] } });
    }, this.options.delay || 500);
  }
}

module.exports = LiveReloadTask;
