// This is the slideshow management for the Other Design section of the Design page
/**
 * If the appropriate data objects are detected, the functions here set 
 * up the trays for and sets slide modals for the 'other design' section (which is NOT rendered from Twig templates)
 */

if(typeof slide_data_other_design !== 'undefined') {
    // Set data
    var otherdesigndata = slide_data_other_design;
    var data_other_parsed_to_array = otherdesigndata.map(el=>Object.values(el));
    console.log(data_other_parsed_to_array )
    var other_holder = document.getElementById('otherdesign_holder');
    
    /**
     * Set up the slides for the 'Other Design' area
     * 1 row of 4 slides (only 4 entries should be available so count limits unnecessary)
     */
    function setMoreDesignSlideTray() { 
        data_other_parsed_to_array.forEach((el)=>{
            var id          = el[0];
            var title       = el[1];
            var thumb       = el[2];
            var img         = el[3];
            var uri         = el[4];
            var url_alias   = el[5];
            // Create element
            var m = new Structure();
            var a = m.make_a('slide',id,uri);
            // Add a couple of additional attributes to the slides
            a.setAttribute('data-img',img);
            a.setAttribute('data-title',title);
            a.setAttribute('data-urlalias',url_alias);
            
            // Add inner tile and label holder
            var tile            = m.make_span('tile');
            var label_holder    = m.make_span('label-holder');
            var project_label   = m.make_span('project-label');
            project_label.innerHTML = title;
            label_holder.append(project_label);

            // Make slide img
            var img             = m.make_img(thumb,title);

            // Assemble slides and add to holder
            
            tile.append(label_holder);
            tile.append(img);
            a.append(tile);
            other_holder.append(a);

            // Add display event listener
            document.getElementById(id).addEventListener('click',(e)=>{
                e.preventDefault();
                slideModal(id,'design');
            })
        })
    }
    window.onload = setMoreDesignSlideTray();
}