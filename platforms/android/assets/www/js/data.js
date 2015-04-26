define({
  peeks: [],
  Peek: {
    init: function(name, bounds) {
      this.name = name;
      this.bounds = bounds;
    },
    toString: function() {
      JSON.dump({name: this.name, bounds: this.bounds});
    }
  },
  init: function(opts) {
    if(opts === undefined) opts = {};
    if(opts.errorHandler !== undefined) this.errorHandler = opts.errorHandler;

    var Data = this;
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.PERSISTENT , 5*1024*1024 /*5MB*/, function(fs) {
      Data.loadDatafile(function(fileEntry) {
        var reader = new FileReader();

         reader.onloadend = function(e) {
           Data.peeks = JSON.parse(this.result);
         };

         reader.readAsText(file);
      });
    });
  },
  addPeek: function(data) {
    this.peeks.push(data);
    this.save();
  },
  save: function() {
    var Data = this;
    this.loadDatafile(function(fileEntry) {
      fileEntry.createWriter(function(fw) {
        fw.seek(fw.length);
        var blob = new Blob($.map(Data.peeks, function() {return this.toString();}), {type: 'text/plain'});
        fw.write(blob);
      });
    });
  },
  loadDatafile: function(callback) {
    fs.root.getFile('data.json', {create: true, exclusive: false}, callback, this.errorHandler);
  },
  errorHandler: function(e) {
    var msg = '';

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };

    if(typeof(this.errorHandler) === 'function') this.errorHandler(msg);
    console.debug('Error: ' + msg);
  }
});
