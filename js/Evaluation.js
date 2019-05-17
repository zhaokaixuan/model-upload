function Evaluation() {
  this.filenames = [];
  this.test_data = [];
  this.index = 0;

  this.add_filename = function(filename) {
      this.filenames.push(filename);
  }
  this.add_data = function(data) {
      this.test_data.push(data);
  }
  this.get_filename = function() {
    return this.filenames[this.index];
  }
  this.num_frames = function() {
    return this.test_data.length;
  }
  this.get_data = function () {
    return this.test_data[this.index];
  }
}