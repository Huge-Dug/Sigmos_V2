document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('graphing-calc-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvasToParent() {
        const parent = canvas.parentElement;
        const rect = parent.getBoundingClientRect();
        const scale = window.devicePixelRatio || 1;

        canvas.style.width  = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        canvas.width  = Math.floor(rect.width * scale);
        canvas.height = Math.floor(rect.height * scale);

        ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }

    resizeCanvasToParent();
    window.addEventListener('resize', resizeCanvasToParent);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '48px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = canvas.width  / (2 * window.devicePixelRatio);
    const y = canvas.height / (2 * window.devicePixelRatio);

    ctx.fillText('This is where the graph will go.', x, y);


});