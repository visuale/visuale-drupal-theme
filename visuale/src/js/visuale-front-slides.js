// Main condition: determine if this is the front page slide area
if(typeof slide_data_front !== 'undefined') {

    // This is slide data rendered by PHP onto the page.
    var data = slide_data_front;
    var data_parsed_to_array        = data.map(el=>Object.values(el));
    var outer_front_slide_block     = document.getElementById('block-visualefrontslides');
    var tray_holder                 = document.getElementById('front_tray_holder');
    // Assign left-motion action for trays.
    var l = document.getElementById('leftarrow');
    // Assign left-motion action for trays.
    var r = document.getElementById('rightarrow');
    // Screen width variables

    var tray_count_setting = 10;
    // CSS Set Tray Heights
    // CSS height value based on its contained slides and images
    function set_tray_height_from_img() {
        if(window.innerWidth >= medium_width) {
            let check_img = document.getElementsByClassName('slide')[0].firstElementChild.lastChild;
        
            let tile = check_img.parentNode;
            // Get grid row gap space
            let gapped_slides = tile.parentNode.parentNode;
            let gap_styles = window.getComputedStyle(gapped_slides);
            let height_test = Math.ceil(gap_styles.getPropertyValue('height').replace('px',''));
            
            // Assign height
            tray_holder.setAttribute('style','height:'+height_test+'px;');
        }
        
    }

    // Set tray groupings
    function set_trays(slides_per_tray=10,slides_tray_size_class='laptop',max_count=50) {
        // Set array count based on slides per tray
        var sorted_slides = data_parsed_to_array.reduce((data_chunked,item,index,array) => {
            const i = Math.floor(index/slides_per_tray)
            
            if(!data_chunked[i]) {
                data_chunked[i] = []
            }
            
            data_chunked[i].push(item)
            return  data_chunked;
        },[]);
        // Test last array for count - if count doesn't = set slides per tray, remove last array
        if(sorted_slides[sorted_slides.length-1].length != slides_per_tray) {
            sorted_slides.pop();
        }

        // Loop through the collection, create trays and fill them with each slide.
        var data_num = 1;
        for(var value of sorted_slides) {
            var d = document.createElement('div');
            d.setAttribute('class','tray');
            d.setAttribute('id','tray_'+data_num);
            if(data_num === 1) {
                d.setAttribute('class',d.getAttribute('class') + ' active');
            }
            
            // Fill each div with its component slides
            for(var slide of value) {
            
                var title;
                (title = slide[1]) ? (!slide[1]) : (title = 'Title unknown')
            
                // Add components
                var c = new Structure();
                // slide tile 
                var t = c.make_span('tile');
                // Label
                var l_holder = c.make_span('label-holder');
                // Project label
                var lb = c.make_span('project-label');
                lb.innerHTML = title;
                // <a>
                var a = c.make_a('slide',slide[0],'#');
                a.setAttribute('data-img',slide[3]);
                a.setAttribute('data-title',title);
                a.setAttribute('data-urlalias',slide[7]);
                var desc = '';
                if(slide[6].length) {
                    desc = slide[6][0].value;
                }
                a.setAttribute('data-desc',desc)
                // <img>
                var img = c.make_img(slide[4],title);
                // Assemble components -  a.slide < span.title span.label-holder < label > img >
                l_holder.append(lb);
                t.append(l_holder);
                t.append(img);
                a.append(t);
                d.append(a);
            }

            // Add tray to tray holder div
            tray_holder.append(d);
            
            // Iterate ahead once
            data_num++
        }
        

        // Get <img> height within each slide (should all be the same)
        /**
         * This is rather complicated, but in order to get the correct row heights, we first waith for the first <img> in the first tray to render.
         * We know that the images will be (or at least should be) all the same height.
         */
        var check_img;
        if(window.innerWidth >= medium_width) {
            check_img = document.getElementsByClassName('slide')[0].firstElementChild.lastChild;
            check_img.addEventListener("load", (e)=> {
                set_tray_height_from_img();
            });
        }
        

        window.addEventListener('resize',(e)=>{
            if(window.innerWidth >= medium_width) {
                set_tray_height_from_img();
            }
        })

        // Now add scrolling actions to the slideshow arrows:
        if(document.getElementsByClassName('tray').length) {
            // Find the arrows and assign scroll actions
            
            l.addEventListener('click',(e)=>{
                e.preventDefault();
                clickleft();
            })

            r.addEventListener('click',(e)=>{
                e.preventDefault();
                clickright();
            })

            // If there are slides, find them
            let cur_slides = document.querySelectorAll('.slide');
            cur_slides.forEach((el)=>{
                var s_id = el.getAttribute('id')
                document.getElementById(s_id).addEventListener('click',(e)=>{
                    e.preventDefault();
                    slideModal(s_id,'front')
                })
            })
            
        }
    }

    // Sets parameters for tray loading function, sends them and make the first tray active
    function manageTraysFront() {
        // First empty the slideshow area
        emptySlideshows('slideshow frontslides');
        // Default slides per tray (2 rows of 5 slides)
        var slides_per_tray = 10;
        var slides_tray_size_class = 'laptop';
        var max_count = 50;
        var s = window.innerWidth;

        if(window.innerWidth >= medium_width) {
            set_trays(slides_per_tray,slides_tray_size_class,max_count);
        }
        
    }

    // This updates the outer slide container to be visible or hidden (or sets a different function)
    function front_display_control() {
        var w = window.innerWidth;
        var c = outer_front_slide_block.className;
        
        if( w >= medium_width) {
            if(tray_holder.hasChildNodes() === false) {
                manageTraysFront();
                outer_front_slide_block.setAttribute('class',c.replace('hidden',''));
            } 
        } else 
        if(w < medium_width) {
            if(tray_holder.hasChildNodes() === true) {
                tray_holder.innerHTML = '';  
            }  
            if(c.indexOf('hidden') === -1) {
                outer_front_slide_block.setAttribute('class',c + ' hidden');  
            }  
        }
    }

    window.addEventListener('load',     function(){ front_display_control(); });
    window.addEventListener('resize',   function(){ front_display_control(); }); 
}
