
function createGWFHtml(container) {
    let c = document.createElement('div');
    c.id = 'gwf-content';

    let s = document.createElement('div');
    s.id = 'gwf-selector';

    let select = document.createElement('select');
    select.id = 'gwf-selector-list';
    s.appendChild(select);

    container.appendChild(c);
    container.appendChild(s);
}

function test_gwf(container) {
    
    createGWFHtml(container);

    httpGetAsync('/gwf/list', function(data) {
        let files = JSON.parse(data);

        const select = document.getElementById('gwf-selector-list');
        for (let i = 0; i < files.length; ++i) {
            let option = document.createElement('option');
            option.value = files[i];
            option.text = files[i];
            select.appendChild(option);
        }

        window.viewer = new SCgViewer('gwf-content');
        function loadFile(fileName) {
            httpGetAsync('/gwf/file/' + fileName, function(data) {
                window.viewer.LoadFromData(data);
                window.viewer.FitSizeToContent();
            });
        }
        select.onchange = function(){
            loadFile(this.options[this.selectedIndex].value);
        };
        if (files.length > 0)
            loadFile(files[0]);
    });
}