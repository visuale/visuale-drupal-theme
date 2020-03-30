class Structure {
    // Make basic <div> with class and id attributes only
    make_div(class_name='',id='') {
        var d = document.createElement('div');
        d.setAttribute('class',class_name);
        d.setAttribute('id',id);
        return d;
    }

    // Make basic <a> with class, id, href and display text values
    make_a(class_name='',id='',href='#',text='') {
        var a = document.createElement('a');
        a.setAttribute('class',class_name);
        a.setAttribute('id',id);
        a.setAttribute('href',href);
        // <a> elements may not always have text to display 
        if(text.length) {
            a.innerHTML = text;
        }
        return a;
    }

    // Make basic span with class name
    make_span(class_name='') {
        var s = document.createElement('span');
        if(class_name.length) {
            s.setAttribute('class',class_name);
        }
        return s;
    }

    // Make basic image
    make_img(uri,alt='') {
        var img = document.createElement('img');
        img.setAttribute('src',uri);
        if(alt.length) {
            img.setAttribute('alt',alt);
        }
        return img;
    }

    
}