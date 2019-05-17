function Evaluator(angle,bounding_boxes,filename) {
    this.camera_angle = angle;
    this.bounding_boxes = bounding_boxes;
    this.filename = filename;
    this._3D_timer = new Timer();
    this.timer = new Timer();

    this.resume_3D_time = function() {
        this._3D_timer.resume();
    }

    this.pause_recording = function () {
        this.pause_time();
        if(!move2D) {
            this.pause_3D_time();
        }
    }

    this.pause_time = function() {
        this.timer.pause();
    }
    this.pause_3D_time = function() {
        this._3D_timer.pause();
    }
    
    this.resume_recording = function() {
        this.resume_time();
        if( !move2D ) {
            this.resume_3D_time();
        }
    }

    this.resume_time = function() {
        this.timer.resume();
    }

}

function Timer() {
    this.time_elapsed = 0;
    this.date = new Date();
    this.running = false;

    this.resume = function() {
        this.date = new Date();
        this.running = true;
    }
    this.pause = function() {
        current_time = new Date();
        this.time_elapsed += current_time.getTime() - this.date.getTime();
        this.state = current_time;
        this.running = false;
    }
}