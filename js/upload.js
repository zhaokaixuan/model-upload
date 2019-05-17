
function upload_files() {
    var x = document.getElementById('file_input');
    if(x.files.length > 0 ){
        for (var i=0; i<x.files.length; i++){
            var filename = x.files[i].name;
            evaluation.add_filename(filename);
        }
        load_data_helper(0, x.files);
    }
}

function load_data_helper(index,files) {
    if(index <evaluation.filenames.length) {
        load_text_file(index,files[index],files);
    }
}

function load_text_file(index,text_file, files) {
    if(text_file) {
        var text_reader = new FileReader();
        text_reader.readAsArrayBuffer(text_file);
        text_reader.onload = function() {
            readData(text_reader);
            load_data_helper(index+1,files);
        }
    }
}

function readData(text_reader) {
    var rawLog = text_reader.result;
    var floatarr = new Float32Array(rawLog);
    evaluation.add_data(floatarr);
    if(evaluation.num_frames() === 1) {
        reset();
        data = evaluation.get_data();
        show();
        
        animate();
        isRecording = false;
        select2DMode();
        document.getElementById('record').style.display = 'block';
        
    }
}


