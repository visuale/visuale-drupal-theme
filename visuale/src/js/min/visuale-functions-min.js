// Determine height from top page has been scrolled down.
const scrollTop=()=>{
    var s = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    return s;
}
// Return the full scroll height of a given page (used mainly to ensure correct modal overlay display)
/**
 * 
 */
const fullHeight=()=>{
    var h;
    h = 0;
    var body = document.body,
    html = document.documentElement;

    var h = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

    return h;
}


// Remove modal from DOM
function removeModal() {
    var m_id = 'modal_container';
    var modal = document.getElementById(m_id);
    modal.setAttribute('class','modal-container remove');

    // Detect transition  out completion and remove styles and class names
    let transitionEvent = whichTransitionEvent(m_id);
    transitionEvent && document.addEventListener(transitionEvent,function(){
        // Remove extra classes
        modal.remove();
    });
}

// Empty Slideshow 
function emptySlideshows(tar = 'slideshow webslides') {
    var slidearea = document.getElementsByClassName(tar);
    while(slidearea.firstChild) {
        slidearea.removeChild(firstChild);
    }
}


 // General functions

// Animation detect function
/**
 * 
 * @param {*} tar 
 */
function whichTransitionEvent(tar) {
    var t;
    var el = document.getElementById(tar);
    var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
    };
    for(t in transitions) {
        if( el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

// Load Image (must be compatible with ES6)
/**
 * 
 * @param {*} src 
 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", err => reject(err));
      img.src = src;
    }); 
}


// Make a slide modal
/**
 * 
 * @param {*} id 
 * @param {*} type // Options: web, logo, design, front
 */
function slideModal(id,type="web") {
  
    var tar = document.getElementById(id);
    var top = scrollTop();
    
    tar.setAttribute('class',tar.getAttribute('class') + ' slide-active');

    // Set vars for content display.
    
    var img_loc;
    var title;
    var desc;
    var alias;
    // If the type is the Web page slides, then these attributes come from the slide objects
    if(type == 'web' || type == 'front') {
        desc = tar.getAttribute('data-desc');
    }
    
    img_loc = tar.getAttribute('data-img');
    title = tar.getAttribute('data-title');
    
    // Image load with post load functionality
    loadImage(img_loc)
    .then(img =>{
        // Set overlay container div
        let m = new Structure();
        
        // Outer container
        var modal_container = m.make_div('modal-container','modal_container');
        // Get "actual" full page height (with all DOM loaded) and apply to the modal container's height
        var modal_height = fullHeight();
        modal_container.style.height = modal_height+'px';
        // Set overlay background div which will be inserted before the display div
        var overlay = m.make_div('slide-modal-overlay','overlay');

        // Create div that will act as a frame for the display content div(s)
        var display_outer_div = m.make_div('display-outer','display_outer');

        // Display actual display content div
        var display_main = m.make_div('display-main','display_main');

        var top_row = m.make_div('top-row','top_row');

        // Populate top row
        // Add title
        var info_title = document.createElement('h3');
        info_title.innerHTML = title;
        top_row.append(info_title);

        // Add close button
        var close_button = m.make_a('button close-button','close_button','#','Close');
        top_row.append(close_button);

        display_main.append(top_row);

        // Set main slide content container – adjust class type depending on showcase (web, logo, other)
        var main_class = 'main-row '+type;
        var main_row = m.make_div('main-row '+type,id);
        
        // Left div with info
        var info_div = m.make_div('info-div','info_div');
        
        // Add description (if available)
        if(type == 'web' || type == 'front') {
            if(desc.length) {
                var info_desc = document.createElement('div');
                info_desc.setAttribute('class','info-desc');
                info_desc.innerHTML = desc;
                info_div.append(info_desc);
            }   
        }

        var url_root;
        
        var ind_url = './node/'+id;
        if(tar.getAttribute('data-urlalias').length) {
            ind_url = '.'+tar.getAttribute('data-urlalias');
        }

        // Add View More link
        var buttons_div = m.make_div('buttons-area','buttons_div');

        var more_a  = m.make_a('button view-more','view_more',ind_url,'Learn More');
        
        // Create/add buttons
        buttons_div.append(more_a);
        info_div.append(buttons_div);
        main_row.append(info_div);

        // Right side

        // Img area
        var img_hold = m.make_div('img-display','img_display');
        img_hold.append(img);
        main_row.append(img_hold);


        // Assemble components
        display_main.append(main_row);
        display_outer_div.append(display_main);
        modal_container.append(overlay);
        modal_container.append(display_outer_div);
        // Finally set display content
        display_outer_div.style.marginTop = (top + 40) +'px';

        // Add final modal
        document.body.append(modal_container);
    })
    
    .then(()=>{
        // Get class attribute and add 'visible' to it to spur visibility transition
        var displayed_content = document.getElementById('modal_container');
        var op_class = displayed_content.getAttribute('class') + ' visible';
        setTimeout(()=>{ displayed_content.setAttribute('class',op_class) },50)
    })
   
    .then(()=>{
        // Remove 'slide-active' from clicked slide after 100ms
        setTimeout(()=>{
            tar.setAttribute('class','slide');
        },100);
        
        // ID's for objects to remove modals
        let touch_close_areas = ['overlay','close_button'];
        // Add Remove functionality
        touch_close_areas.forEach((el)=>{
            document.getElementById(el).addEventListener('click',()=>{
                removeModal();
            })
        })
    })
    .catch(err => console.error(err)); 
 }


 // Slide trays left control
 function clickright() {
    // Find currently active tray and add class attribute to move left
    let tray_count = tray_holder.childNodes.length;
    let cur = document.getElementsByClassName('tray active')[0].id; 
    let cur_id = cur.replace('tray_','');
    let cur_tray = document.getElementById(cur)
    let w = cur_tray.offsetWidth;
    let offX = cur_tray.offsetLeft;
    cur_tray.setAttribute('style','max-width:'+ w +'px;transition:left '+trans_time+';left:-'+ w +'px;')

    // Find next tray and move to display position

    let next = parseInt(cur_id) + 1;
    if(next >= tray_count) { next = 1; }
    let next_tray = document.getElementById('tray_'+next);
    next_tray.className += ' enter';
    // Animate in
    next_tray.setAttribute('style',
        'width:'+ w +'px;max-width:'+ w +'px;transition:left '+trans_time+';left:'+ offX +'px;'
    )

    // Detect transition  out completion and remove styles and class names
    let transitionEvent = whichTransitionEvent(cur);
    transitionEvent && document.addEventListener(transitionEvent,function(){
        // Remove extra classes
        cur_tray.setAttribute('class','tray');
        cur_tray.removeAttribute('style');
        next_tray.setAttribute('class','tray active');
    }) 
};

// FRONT Slideshow functions (possibly to be used elsewhere)

// Slide trays right
function clickleft() {

    // Find current active tray and add class to move right
    let tray_count = document.getElementsByClassName('tray').length;
    let cur = document.getElementsByClassName('active')[0].id;  
    let cur_id = cur.replace('tray_','');
    let cur_tray = document.getElementById(cur);
    let w = cur_tray.offsetWidth;
    let offX = cur_tray.offsetLeft;
    cur_tray.setAttribute('style','transition: left '+trans_time+';left: '+parseInt(offX+w)+'px;')

    let next = cur_id - 1;
    if(next == 0) { next = tray_count;}
    let next_tray = document.getElementById('tray_'+next);
    // Start by setting initial position to the left of the visibile area
    next_tray.className += ' enter';
    // Set position of next slide (animation is in separate function)
    next_tray.setAttribute('style','width: '+w+'px;max-width: '+w+'px;left:-'+ offX + w +'px;');
    // Now animate the transition into place
    move_next_left(cur_id);
}

function move_next_left(cur_id) {
    let tray_count = document.getElementsByClassName('tray').length;
    let next = cur_id - 1;
    if(next == 0) { next = tray_count;}
    let next_tray = document.getElementById('tray_'+next);
    let cur_tray = document.getElementById('tray_'+cur_id);
    let w = cur_tray.offsetWidth;
    let offX = cur_tray.offsetLeft;
    next_tray.setAttribute('style','width: '+w+'px;max-width: '+w+'px;transition: left '+trans_time+';left:-'+ offX +'px;');
    
    // Detect transition  out completion and remove styles and class names
    let transitionEvent = whichTransitionEvent('tray_'+cur_id);
    transitionEvent && document.addEventListener(transitionEvent,function(){
        // Remove extra classes
        next_tray.setAttribute('class','tray active');
        cur_tray.setAttribute('class','tray')
        cur_tray.removeAttribute('style')   
    }) 
}
