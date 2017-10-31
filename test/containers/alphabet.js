// <div id="alphabet-content"></div>

function test_alphabet(container) {
    let c = document.createElement('div');
    c.id = 'alphabet-content';

    container.appendChild(c);
    
    let viewer = new SCgViewer('alphabet-content');
    viewer._testShowAlphabet();
}