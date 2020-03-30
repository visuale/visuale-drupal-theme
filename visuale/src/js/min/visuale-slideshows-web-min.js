// Scripts for managing the Web page slide tray (front page and design page handled elsewhere)

// Detect the slide tray for web (slide_data)
// This comes from a JSON object rendered on the page itself.
if(typeof slide_data !== 'undefined') {
    var data = slide_data;
    var data_parsed_to_array = data.map(el=>Object.values(el));
    var holder = document.getElementById('holder');
    var outer_slide_block = document.getElementById('block-visualewebslides');

    /**
     * This is the Web Slides Setter
     * 
     * @param {*} data_sorted 
     * @param {*} slides_tray_size_class 
     * @param {*} max_count 
     */
    const set_trays=(data_sorted,slides_tray_size_class='laptop',max_count=50)=>{
        // Fill each div with its component slides
        
        for(var slide of data_sorted) {
            let title
            (title = slide[1]) ? (!slide[1]) : (title = 'Title unknown')
            
            // slide tile 
            var t = document.createElement('div');
            t.setAttribute('class','tile');
            // label holder
            var l_holder = document.createElement('span');
            l_holder.setAttribute('class','label-holder');
            // label
            var l = document.createElement('span');
            l.setAttribute('class','project-label');
            l.innerHTML = title;

            // <a>
            var ac = new Structure();
            var slide_id = slide[0];
            var a = ac.make_a('slide',slide_id);
            a.setAttribute('data-img',slide[3]);
            a.setAttribute('alt','Slide for project '+ title);
            a.setAttribute('data-title',title);
            a.setAttribute('data-urlalias',slide[8]);
            
            var d = '';
            if(slide[7][0]) {d = slide[7][0].value}
            a.setAttribute('data-desc',d)
        
            // <img>
            var img = document.createElement('img');
            img.setAttribute('src', slide[4]);
            img.setAttribute('alt',title);

            // Assemble components (<img> added to <a> added to <div.slide>)
            l_holder.append(l);
            t.append(l_holder);
            t.append(img);
            a.append(t);
            holder.append(a);
        }

        // As we're out of the loop, now we can add the modal click function
        var slides_found = document.getElementsByClassName('slide');
        [].forEach.call(slides_found, (el)=>{
            document.getElementById(el.id).addEventListener('click',(e)=>{
                e.preventDefault();
                slideModal(el.id)});
        });

        // Get <img> height within each slide (should all be the same)
        // This is rather complicated, but in order to get the correct row heights, we first waith for the first <img> in the first tray to render.
        // We know that the images will be (or at least should be) all the same height.
        // <img> resource to check.
        var check_img = document.getElementsByClassName('slide')[0].firstElementChild.firstElementChild.firstElementChild;
    
    }


    // Sets parameters for tray loading function, sends them and make the first tray active
    function manageTraysWeb() {

        // Set ID attr for layout holder
        let l = document.getElementsByTagName('div');
        for(var i = 0;i < l.length;i++) {
            if(l[i].getAttribute('class') == 'layout-container main-content'){
                l[i].setAttribute('id','modal_display_container');
                break;
            }
        }
        // First empty the slideshow area
        emptySlideshows();
        // Default slides per tray (2 rows of 5 slides)
        
        var slides_tray_size_class = 'laptop';
        var max_count = 50;
        var s = screen.width;

        // Sort the slide tray placing the featured slides first

        // Array
        var data_sorted = [];
        var data_sorted_priority = [];
        var data_sorted_non_priority = [];

        for(var slide of data_parsed_to_array) {
            let val = slide[5][0];
            if(val && val.value == 1) {
                data_sorted_priority.push(slide);
            } else {
                if(!val) {
                    data_sorted_non_priority.push(slide);
                }
            }
        }
        // Assemble two separate arrays here.
        data_sorted = data_sorted_priority.concat(data_sorted_non_priority);
        // Set tray/trays
        
        set_trays(data_sorted,slides_tray_size_class,max_count);
    }

    // This updates the outer slide container to be visible or hidden (or sets a different function)
    function slideshow_display_control() {
        
        var w = window.innerWidth;
        var c = outer_slide_block.className;
        
        if( w >= medium_width) {
            if(holder.hasChildNodes() === false) {
                manageTraysWeb();
            }
            outer_slide_block.setAttribute('class',c.replace('hidden',''));
        } else 
        if(w < medium_width) {
            if(c.indexOf('hidden') === -1) {
                outer_slide_block.setAttribute('class',c + ' hidden');
                emptySlideshows();
            }      
        }
    }

    window.addEventListener('load',function(){ slideshow_display_control(); });
    window.addEventListener('resize',function(){ slideshow_display_control(); }); 
    
}