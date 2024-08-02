(function() {
    // eslint-disable-next-line no-unused-vars
    let pjax;

    function initPjax() {
        try {
            const Pjax = window.Pjax || function() {};
            pjax = new Pjax({
                selectors: [
                    '[data-pjax]',
                    '.pjax-reload',
                    'head title',
                    '.columns',
                    '.navbar-start',
                    '.navbar-end',
                    '.searchbox link',
                    '.searchbox script',
                    '#back-to-top',
                    '#comments link',
                    '#comments script'
                ]
            });
        } catch (e) {
            console.warn('PJAX error: ' + e);
        }
    }

    // // Listen for start of Pjax
    // document.addEventListener('pjax:send', function() {
    //     return;
    //     // TODO pace start loading animation
    // })

    // // Listen for completion of Pjax
    // document.addEventListener('pjax:complete', function() {
    //     return;
    //     // TODO pace stop loading animation
    // })
    const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.injector.register('head_end', () => {
  return js('//lib.baomitu.com/pjax/0.2.8/pjax.min.js');
});

hexo.extend.injector.register('head_end', () => {
  return js('/js/SetPjax.js');
});
    document.addEventListener('DOMContentLoaded', () => initPjax());
}());
