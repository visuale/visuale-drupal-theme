// This is the slideshow management for the Logo section Design page
/**
 * If the appropriate data object is detected, the functions here apply a slide modal to the array of objects, which are rendered 
 * from a Twig template and custom module.
 */
if(typeof slide_data_logo !== 'undefined') {
    // Set data
    var logodata = slide_data_logo;
    var data_logo_parsed_to_array = logodata.map(el=>Object.values(el));
    var holder = document.getElementById('holder');
    
       
    function setLogoSlides() {
        // Apply slide modal action to the slides specifically in the logo section
        document.querySelectorAll('.logoslides .slide').forEach((el)=>{
            var id = el.getAttribute('id');
            document.getElementById(id).addEventListener('click',(e)=>{
                e.preventDefault();
                slideModal(id,'logo')
            });
        })
    }

    function logoSlideshowDisplayControl() {
        var w = window.innerWidth;
        var c = holder.className;
        
        if(w >= medium_width) {
            holder.setAttribute('class',c.replace('hidden',''));
        } else
        if(w < medium_width) {
            if(c.indexOf('hidden') === -1) {
                holder.setAttribute('class',c + ' hidden');
            }
        }
    }

    
    // Init based on current browser window width
    window.addEventListener('load',function(){ logoSlideshowDisplayControl(holder); });
    window.addEventListener('resize',function(){ logoSlideshowDisplayControl(holder); }); 

}