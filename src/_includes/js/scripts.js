// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
 	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */
(function() {
  // make focus ring visible only for keyboard navigation (i.e., tab key) 
  var focusTab = document.getElementsByClassName('js-tab-focus');
  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusTabs(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusTabs(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
  };

  function resetFocusTabs(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };
  window.addEventListener('mousedown', detectClick);
}());
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
	var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
	if( menuBtns.length > 0 ) {
		for(var i = 0; i < menuBtns.length; i++) {(function(i){
			initMenuBtn(menuBtns[i]);
		})(i);}

		function initMenuBtn(btn) {
			btn.addEventListener('click', function(event){	
				event.preventDefault();
				var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
				Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
				// emit custom event
				var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
				btn.dispatchEvent(event);
			});
		};
	}
}());
// File#: _1_countdown
// Usage: codyhouse.co/license
(function() {
  var CountDown = function(element) {
    this.element = element;
    this.labels = this.element.getAttribute('data-labels') ? this.element.getAttribute('data-labels').split(',') : [];
    this.intervalId;
    //create countdown HTML
    this.createCountDown();
    //store time elements
    this.days = this.element.getElementsByClassName('js-countdown__value--0')[0];
    this.hours = this.element.getElementsByClassName('js-countdown__value--1')[0];
    this.mins = this.element.getElementsByClassName('js-countdown__value--2')[0];
    this.secs = this.element.getElementsByClassName('js-countdown__value--3')[0];
    this.endTime = this.getEndTime();
    //init counter
    this.initCountDown();
  };

  CountDown.prototype.createCountDown = function() {
    var wrapper = document.createElement("div");
    Util.setAttributes(wrapper, {'aria-hidden': 'true', 'class': 'countdown__timer'});

    for(var i = 0; i < 4; i++) {
      var timeItem = document.createElement("span"),
        timeValue = document.createElement("span"),
        timeLabel = document.createElement('span');
      
      timeItem.setAttribute('class', 'countdown__item');
      timeValue.setAttribute('class', 'countdown__value countdown__value--'+i+' js-countdown__value--'+i);
      timeItem.appendChild(timeValue);

      if( this.labels && this.labels.length > 0 ) {
        timeLabel.textContent = this.labels[i].trim();
        timeLabel.setAttribute('class', 'countdown__label');
        timeItem.appendChild(timeLabel);
      }
      
      wrapper.appendChild(timeItem);
    }
    // append new content to countdown element
    this.element.insertBefore(wrapper, this.element.firstChild);
    // this.element.appendChild(wrapper);
  };

  CountDown.prototype.getEndTime = function() {
    // get number of remaining seconds 
    if(this.element.getAttribute('data-timer')) return Number(this.element.getAttribute('data-timer'))*1000 + new Date().getTime();
    else if(this.element.getAttribute('data-countdown')) return Number(new Date(this.element.getAttribute('data-countdown')).getTime());
  };

  CountDown.prototype.initCountDown = function() {
    var self = this;
    this.intervalId = setInterval(function(){
      self.updateCountDown(false);
    }, 1000);
    this.updateCountDown(true);
  };
  
  CountDown.prototype.updateCountDown = function(bool) {
    // original countdown function
    // https://gist.github.com/adriennetacke/f5a25c304f1b7b4a6fa42db70415bad2
    var time = parseInt( (this.endTime - new Date().getTime())/1000 ),
      days = 0,
      hours = 0,
      mins = 0,
      seconds = 0;

    if(isNaN(time) || time < 0) {
      clearInterval(this.intervalId);
      this.emitEndEvent();
    } else {
      days = parseInt(time / 86400);
      time = (time % 86400);
      hours = parseInt(time / 3600);
      time = (time % 3600);
      mins = parseInt(time / 60);
      time = (time % 60);
      seconds = parseInt(time);
    }
    
    // hide days/hours/mins if not available 
    if(bool && days == 0) this.days.parentElement.style.display = "none";
    if(bool && days == 0 && hours == 0) this.hours.parentElement.style.display = "none";
    if(bool && days == 0 && hours == 0 && mins == 0) this.mins.parentElement.style.display = "none";
    
    this.days.textContent = days;
    this.hours.textContent = this.getTimeFormat(hours);
    this.mins.textContent = this.getTimeFormat(mins);
    this.secs.textContent = this.getTimeFormat(seconds);
  };

  CountDown.prototype.getTimeFormat = function(time) {
    return ('0'+ time).slice(-2);
  };

  CountDown.prototype.emitEndEvent = function(time) {
    var event = new CustomEvent('countDownFinished');
    this.element.dispatchEvent(event);
  };

  //initialize the CountDown objects
  var countDown = document.getElementsByClassName('js-countdown');
  if( countDown.length > 0 ) {
    for( var i = 0; i < countDown.length; i++) {
      (function(i){new CountDown(countDown[i]);})(i);
    }
  }
}());
// File#: _1_filter-navigation
// Usage: codyhouse.co/license
(function () {
    var FilterNav = function (element) {
        this.element = element;
        this.wrapper = this.element.getElementsByClassName('js-filter-nav__wrapper')[0];
        this.nav = this.element.getElementsByClassName('js-filter-nav__nav')[0];
        this.list = this.nav.getElementsByClassName('js-filter-nav__list')[0];
        this.control = this.element.getElementsByClassName('js-filter-nav__control')[0];
        this.modalClose = this.element.getElementsByClassName('js-filter-nav__close-btn')[0];
        this.placeholder = this.element.getElementsByClassName('js-filter-nav__placeholder')[0];
        this.marker = this.element.getElementsByClassName('js-filter-nav__marker');
        this.layout = 'expanded';
        initFilterNav(this);
    };

    function initFilterNav(element) {
        checkLayout(element); // init layout
        if (element.layout == 'expanded') placeMarker(element);
        element.element.addEventListener('update-layout', function (event) { // on resize - modify layout
            checkLayout(element);
        });

        // update selected item
        element.wrapper.addEventListener('click', function (event) {
            var newItem = event.target.closest('.js-filter-nav__btn');
            if (newItem) {
                updateCurrentItem(element, newItem);
                return;
            }
            // close modal list - mobile version only
            if (Util.hasClass(event.target, 'js-filter-nav__wrapper') || event.target.closest('.js-filter-nav__close-btn')) toggleModalList(element, false);
        });

        // open modal list - mobile version only
        element.control.addEventListener('click', function (event) {
            toggleModalList(element, true);
        });

        // listen for key events
        window.addEventListener('keyup', function (event) {
            // listen for esc key
            if ((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) {
                // close navigation on mobile if open
                if (element.control.getAttribute('aria-expanded') == 'true' && isVisible(element.control)) {
                    toggleModalList(element, false);
                }
            }
            // listen for tab key
            if ((event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab')) {
                // close navigation on mobile if open when nav loses focus
                if (element.control.getAttribute('aria-expanded') == 'true' && isVisible(element.control) && !document.activeElement.closest('.js-filter-nav__wrapper')) toggleModalList(element, false);
            }
        });
    };

    function updateCurrentItem(element, btn) {
        if (btn.getAttribute('aria-current') == 'true') {
            toggleModalList(element, false);
            return;
        }
        var activeBtn = element.wrapper.querySelector('[aria-current]');
        if (activeBtn) activeBtn.removeAttribute('aria-current');
        btn.setAttribute('aria-current', 'true');
        // update trigger label on selection (visible on mobile only)
        element.placeholder.textContent = btn.textContent;
        toggleModalList(element, false);
        if (element.layout == 'expanded') placeMarker(element);
    };

    function toggleModalList(element, bool) {
        element.control.setAttribute('aria-expanded', bool);
        Util.toggleClass(element.wrapper, 'filter-nav__wrapper--is-visible', bool);
        if (bool) {
            element.nav.querySelectorAll('[href], button:not([disabled])')[0].focus();
        } else if (isVisible(element.control)) {
            element.control.focus();
        }
    };

    function isVisible(element) {
        return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };

    function checkLayout(element) {
        if (element.layout == 'expanded' && switchToCollapsed(element)) { // check if there's enough space 
            element.layout = 'collapsed';
            Util.removeClass(element.element, 'filter-nav--expanded');
            Util.addClass(element.element, 'filter-nav--collapsed');
            Util.removeClass(element.modalClose, 'is-hidden');
            Util.removeClass(element.control, 'is-hidden');
        } else if (element.layout == 'collapsed' && switchToExpanded(element)) {
            element.layout = 'expanded';
            Util.addClass(element.element, 'filter-nav--expanded');
            Util.removeClass(element.element, 'filter-nav--collapsed');
            Util.addClass(element.modalClose, 'is-hidden');
            Util.addClass(element.control, 'is-hidden');
        }
        // place background element
        if (element.layout == 'expanded') placeMarker(element);
    };

    function switchToCollapsed(element) {
        return element.nav.scrollWidth > element.nav.offsetWidth;
    };

    function switchToExpanded(element) {
        element.element.style.visibility = 'hidden';
        Util.addClass(element.element, 'filter-nav--expanded');
        Util.removeClass(element.element, 'filter-nav--collapsed');
        var switchLayout = element.nav.scrollWidth <= element.nav.offsetWidth;
        Util.removeClass(element.element, 'filter-nav--expanded');
        Util.addClass(element.element, 'filter-nav--collapsed');
        element.element.style.visibility = 'visible';
        return switchLayout;
    };

    function placeMarker(element) {
        var activeElement = element.wrapper.querySelector('.js-filter-nav__btn[aria-current="true"]');
        if (element.marker.length == 0 || !activeElement) return;
        element.marker[0].style.width = activeElement.offsetWidth + 'px';
        element.marker[0].style.transform = 'translateX(' + (activeElement.getBoundingClientRect().left - element.list.getBoundingClientRect().left) + 'px)';
    };

    var filterNav = document.getElementsByClassName('js-filter-nav');
    if (filterNav.length > 0) {
        var filterNavArray = [];
        for (var i = 0; i < filterNav.length; i++) {
            filterNavArray.push(new FilterNav(filterNav[i]));
        }

        var resizingId = false,
            customEvent = new CustomEvent('update-layout');

        window.addEventListener('resize', function () {
            clearTimeout(resizingId);
            resizingId = setTimeout(doneResizing, 100);
        });

        // wait for font to be loaded
        if (document.fonts) {
            document.fonts.onloadingdone = function (fontFaceSetEvent) {
                doneResizing();
            };
        }

        function doneResizing() {
            for (var i = 0; i < filterNavArray.length; i++) {
                (function (i) {
                    filterNavArray[i].element.dispatchEvent(customEvent)
                })(i);
            };
        };
    }
}());
// File#: _1_filter
// Usage: codyhouse.co/license

(function () {
    var Filter = function (opts) {
        this.options = Util.extend(Filter.defaults, opts); // used to store custom filter/sort functions
        this.element = this.options.element;
        this.elementId = this.element.getAttribute('id');
        this.items = this.element.querySelectorAll('.js-filter__item');
        this.controllers = document.querySelectorAll('[aria-controls="' + this.elementId + '"]'); // controllers wrappers
        this.fallbackMessage = document.querySelector('[data-fallback-gallery-id="' + this.elementId + '"]');
        this.filterString = []; // combination of different filter values
        this.sortingString = ''; // sort value - will include order and type of argument (e.g., number or string)
        // store info about sorted/filtered items
        this.filterList = []; // list of boolean for each this.item -> true if still visible , otherwise false
        this.sortingList = []; // list of new ordered this.item -> each element is [item, originalIndex]

        // store grid info for animation
        this.itemsGrid = []; // grid coordinates
        this.itemsInitPosition = []; // used to store coordinates of this.items before animation
        this.itemsIterPosition = []; // used to store coordinates of this.items before animation - intermediate state
        this.itemsFinalPosition = []; // used to store coordinates of this.items after filtering

        // animation off
        this.animateOff = this.element.getAttribute('data-filter-animation') == 'off';
        // used to update this.itemsGrid on resize
        this.resizingId = false;
        // default acceleration style - improve animation
        this.accelerateStyle = 'will-change: transform, opacity; transform: translateZ(0); backface-visibility: hidden;';

        // handle multiple changes
        this.animating = false;
        this.reanimate = false;

        initFilter(this);
    };

    function initFilter(filter) {
        resetFilterSortArray(filter, true, true); // init array filter.filterList/filter.sortingList
        createGridInfo(filter); // store grid coordinates in filter.itemsGrid
        initItemsOrder(filter); // add data-orders so that we can reset the sorting

        // events handling - filter update
        for (var i = 0; i < filter.controllers.length; i++) {
            filter.filterString[i] = ''; // reset filtering

            // get proper filter/sorting string based on selected controllers
            (function (i) {
                filter.controllers[i].addEventListener('change', function (event) {
                    if (event.target.tagName.toLowerCase() == 'select') { // select elements
                        (!event.target.getAttribute('data-filter')) ?
                        setSortingString(filter, event.target.value, event.target.options[event.target.selectedIndex]): setFilterString(filter, i, 'select');
                    } else if (event.target.tagName.toLowerCase() == 'input' && (event.target.getAttribute('type') == 'radio' || event.target.getAttribute('type') == 'checkbox')) { // input (radio/checkboxed) elements
                        (!event.target.getAttribute('data-filter')) ?
                        setSortingString(filter, event.target.getAttribute('data-sort'), event.target): setFilterString(filter, i, 'input');
                    } else {
                        // generic inout element
                        (!filter.controllers[i].getAttribute('data-filter')) ?
                        setSortingString(filter, filter.controllers[i].getAttribute('data-sort'), filter.controllers[i]): setFilterString(filter, i, 'custom');
                    }

                    updateFilterArray(filter);
                });

                filter.controllers[i].addEventListener('click', function (event) { // retunr if target is select/input elements
                    var filterEl = event.target.closest('[data-filter]');
                    var sortEl = event.target.closest('[data-sort]');
                    if (!filterEl && !sortEl) return;
                    if (filterEl && (filterEl.tagName.toLowerCase() == 'input' || filterEl.tagName.toLowerCase() == 'select')) return;
                    if (sortEl && (sortEl.tagName.toLowerCase() == 'input' || sortEl.tagName.toLowerCase() == 'select')) return;
                    if (sortEl && Util.hasClass(sortEl, 'js-filter__custom-control')) return;
                    if (filterEl && Util.hasClass(filterEl, 'js-filter__custom-control')) return;
                    // this will be executed only for a list of buttons -> no inputs
                    event.preventDefault();
                    resetControllersList(filter, i, filterEl, sortEl);
                    sortEl
                        ?
                        setSortingString(filter, sortEl.getAttribute('data-sort'), sortEl) :
                        setFilterString(filter, i, 'button');
                    updateFilterArray(filter);
                });
            })(i);
        }

        // handle resize - update grid coordinates in filter.itemsGrid
        window.addEventListener('resize', function () {
            clearTimeout(filter.resizingId);
            filter.resizingId = setTimeout(function () {
                createGridInfo(filter)
            }, 300);
        });

        // check if there are filters/sorting values already set
        checkInitialFiltering(filter);

        // reset filtering results if filter selection was changed by an external control (e.g., form reset) 
        filter.element.addEventListener('update-filter-results', function (event) {
            // reset filters first
            for (var i = 0; i < filter.controllers.length; i++) filter.filterString[i] = '';
            filter.sortingString = '';
            checkInitialFiltering(filter);
        });
    };

    function checkInitialFiltering(filter) {
        for (var i = 0; i < filter.controllers.length; i++) { // check if there's a selected option
            // buttons list
            var selectedButton = filter.controllers[i].getElementsByClassName('js-filter-selected');
            if (selectedButton.length > 0) {
                var sort = selectedButton[0].getAttribute('data-sort');
                sort
                    ?
                    setSortingString(filter, selectedButton[0].getAttribute('data-sort'), selectedButton[0]) :
                    setFilterString(filter, i, 'button');
                continue;
            }

            // input list
            var selectedInput = filter.controllers[i].querySelectorAll('input:checked');
            if (selectedInput.length > 0) {
                var sort = selectedInput[0].getAttribute('data-sort');
                sort
                    ?
                    setSortingString(filter, sort, selectedInput[0]) :
                    setFilterString(filter, i, 'input');
                continue;
            }
            // select item
            if (filter.controllers[i].tagName.toLowerCase() == 'select') {
                var sort = filter.controllers[i].getAttribute('data-sort');
                sort
                    ?
                    setSortingString(filter, filter.controllers[i].value, filter.controllers[i].options[filter.controllers[i].selectedIndex]) :
                    setFilterString(filter, i, 'select');
                continue;
            }
            // check if there's a generic custom input
            var radioInput = filter.controllers[i].querySelector('input[type="radio"]'),
                checkboxInput = filter.controllers[i].querySelector('input[type="checkbox"]');
            if (!radioInput && !checkboxInput) {
                var sort = filter.controllers[i].getAttribute('data-sort');
                var filterString = filter.controllers[i].getAttribute('data-filter');
                if (sort) setSortingString(filter, sort, filter.controllers[i]);
                else if (filterString) setFilterString(filter, i, 'custom');
            }
        }

        updateFilterArray(filter);
    };

    function setSortingString(filter, value, item) {
        // get sorting string value-> sortName:order:type
        var order = item.getAttribute('data-sort-order') ? 'desc' : 'asc';
        var type = item.getAttribute('data-sort-number') ? 'number' : 'string';
        filter.sortingString = value + ':' + order + ':' + type;
    };

    function setFilterString(filter, index, type) {
        // get filtering array -> [filter1:filter2, filter3, filter4:filter5]
        if (type == 'input') {
            var checkedInputs = filter.controllers[index].querySelectorAll('input:checked');
            filter.filterString[index] = '';
            for (var i = 0; i < checkedInputs.length; i++) {
                filter.filterString[index] = filter.filterString[index] + checkedInputs[i].getAttribute('data-filter') + ':';
            }
        } else if (type == 'select') {
            if (filter.controllers[index].multiple) { // select with multiple options
                filter.filterString[index] = getMultipleSelectValues(filter.controllers[index]);
            } else { // select with single option
                filter.filterString[index] = filter.controllers[index].value;
            }
        } else if (type == 'button') {
            var selectedButtons = filter.controllers[index].querySelectorAll('.js-filter-selected');
            filter.filterString[index] = '';
            for (var i = 0; i < selectedButtons.length; i++) {
                filter.filterString[index] = filter.filterString[index] + selectedButtons[i].getAttribute('data-filter') + ':';
            }
        } else if (type == 'custom') {
            filter.filterString[index] = filter.controllers[index].getAttribute('data-filter');
        }
    };

    function resetControllersList(filter, index, target1, target2) {
        // for a <button>s list -> toggle js-filter-selected + custom classes
        var multi = filter.controllers[index].getAttribute('data-filter-checkbox'),
            customClass = filter.controllers[index].getAttribute('data-selected-class');

        customClass = (customClass) ? 'js-filter-selected ' + customClass : 'js-filter-selected';
        if (multi == 'true') { // multiple options can be on
            (target1) ?
            Util.toggleClass(target1, customClass, !Util.hasClass(target1, 'js-filter-selected')): Util.toggleClass(target2, customClass, !Util.hasClass(target2, 'js-filter-selected'));
        } else { // only one element at the time
            // remove the class from all siblings
            var selectedOption = filter.controllers[index].querySelector('.js-filter-selected');
            if (selectedOption) Util.removeClass(selectedOption, customClass);
            (target1) ?
            Util.addClass(target1, customClass): Util.addClass(target2, customClass);
        }
    };

    function updateFilterArray(filter) { // sort/filter strings have been updated -> so you can update the gallery
        if (filter.animating) {
            filter.reanimate = true;
            return;
        }
        filter.animating = true;
        filter.reanimate = false;
        createGridInfo(filter); // get new grid coordinates
        sortingGallery(filter); // update sorting list 
        filteringGallery(filter); // update filter list
        resetFallbackMessage(filter, true); // toggle fallback message
        if (reducedMotion || filter.animateOff) {
            resetItems(filter);
        } else {
            updateItemsAttributes(filter);
        }
    };

    function sortingGallery(filter) {
        // use sorting string to reorder gallery
        var sortOptions = filter.sortingString.split(':');
        if (sortOptions[0] == '' || sortOptions[0] == '*') {
            // no sorting needed
            restoreSortOrder(filter);
        } else { // need to sort
            if (filter.options[sortOptions[0]]) { // custom sort function -> user takes care of it
                filter.sortingList = filter.options[sortOptions[0]](filter.sortingList);
            } else {
                filter.sortingList.sort(function (left, right) {
                    var leftVal = left[0].getAttribute('data-sort-' + sortOptions[0]),
                        rightVal = right[0].getAttribute('data-sort-' + sortOptions[0]);
                    if (sortOptions[2] == 'number') {
                        leftVal = parseFloat(leftVal);
                        rightVal = parseFloat(rightVal);
                    }
                    if (sortOptions[1] == 'desc') return leftVal <= rightVal ? 1 : -1;
                    else return leftVal >= rightVal ? 1 : -1;
                });
            }
        }
    };

    function filteringGallery(filter) {
        // use filtering string to reorder gallery
        resetFilterSortArray(filter, true, false);
        // we can have multiple filters
        for (var i = 0; i < filter.filterString.length; i++) {
            //check if multiple filters inside the same controller
            if (filter.filterString[i] != '' && filter.filterString[i] != '*' && filter.filterString[i] != ' ') {
                singleFilterGallery(filter, filter.filterString[i].split(':'));
            }
        }
    };

    function singleFilterGallery(filter, subfilter) {
        if (!subfilter || subfilter == '' || subfilter == '*') return;
        // check if we have custom options
        var customFilterArray = [];
        for (var j = 0; j < subfilter.length; j++) {
            if (filter.options[subfilter[j]]) { // custom function
                customFilterArray[subfilter[j]] = filter.options[subfilter[j]](filter.items);
            }
        }

        for (var i = 0; i < filter.items.length; i++) {
            var filterValues = filter.items[i].getAttribute('data-filter').split(' ');
            var present = false;
            for (var j = 0; j < subfilter.length; j++) {
                if (filter.options[subfilter[j]] && customFilterArray[subfilter[j]][i]) { // custom function
                    present = true;
                    break;
                } else if (subfilter[j] == '*' || filterValues.indexOf(subfilter[j]) > -1) {
                    present = true;
                    break;
                }
            }
            filter.filterList[i] = !present ? false : filter.filterList[i];
        }
    };

    function updateItemsAttributes(filter) { // set items before triggering the update animation
        // get offset of all elements before animation
        storeOffset(filter, filter.itemsInitPosition);
        // set height of container
        filter.element.setAttribute('style', 'height: ' + parseFloat(filter.element.offsetHeight) + 'px; width: ' + parseFloat(filter.element.offsetWidth) + 'px;');

        for (var i = 0; i < filter.items.length; i++) { // remove is-hidden class from items now visible and scale to zero
            if (Util.hasClass(filter.items[i], 'is-hidden') && filter.filterList[i]) {
                filter.items[i].setAttribute('data-scale', 'on');
                filter.items[i].setAttribute('style', filter.accelerateStyle + 'transform: scale(0.5); opacity: 0;')
                Util.removeClass(filter.items[i], 'is-hidden');
            }
        }
        // get new elements offset
        storeOffset(filter, filter.itemsIterPosition);
        // translate items so that they are in the right initial position
        for (var i = 0; i < filter.items.length; i++) {
            if (filter.items[i].getAttribute('data-scale') != 'on') {
                filter.items[i].setAttribute('style', filter.accelerateStyle + 'transform: translateX(' + parseInt(filter.itemsInitPosition[i][0] - filter.itemsIterPosition[i][0]) + 'px) translateY(' + parseInt(filter.itemsInitPosition[i][1] - filter.itemsIterPosition[i][1]) + 'px);');
            }
        }

        animateItems(filter)
    };

    function animateItems(filter) {
        var transitionValue = 'transform ' + filter.options.duration + 'ms cubic-bezier(0.455, 0.03, 0.515, 0.955), opacity ' + filter.options.duration + 'ms';

        // get new index of items in the list
        var j = 0;
        for (var i = 0; i < filter.sortingList.length; i++) {
            var item = filter.items[filter.sortingList[i][1]];

            if (Util.hasClass(item, 'is-hidden') || !filter.filterList[filter.sortingList[i][1]]) {
                // item is hidden or was previously hidden -> final position equal to first one
                filter.itemsFinalPosition[filter.sortingList[i][1]] = filter.itemsIterPosition[filter.sortingList[i][1]];
                if (item.getAttribute('data-scale') == 'on') j = j + 1;
            } else {
                filter.itemsFinalPosition[filter.sortingList[i][1]] = [filter.itemsGrid[j][0], filter.itemsGrid[j][1]]; // left/top
                j = j + 1;
            }
        }

        setTimeout(function () {
            for (var i = 0; i < filter.items.length; i++) {
                if (filter.filterList[i] && filter.items[i].getAttribute('data-scale') == 'on') { // scale up item
                    filter.items[i].setAttribute('style', filter.accelerateStyle + 'transition: ' + transitionValue + '; transform: translateX(' + parseInt(filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0]) + 'px) translateY(' + parseInt(filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1]) + 'px) scale(1); opacity: 1;');
                } else if (filter.filterList[i]) { // translate item
                    filter.items[i].setAttribute('style', filter.accelerateStyle + 'transition: ' + transitionValue + '; transform: translateX(' + parseInt(filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0]) + 'px) translateY(' + parseInt(filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1]) + 'px);');
                } else { // scale down item
                    filter.items[i].setAttribute('style', filter.accelerateStyle + 'transition: ' + transitionValue + '; transform: scale(0.5); opacity: 0;');
                }
            };
        }, 50);

        // wait for the end of transition of visible elements
        setTimeout(function () {
            resetItems(filter);
        }, (filter.options.duration + 100));
    };

    function resetItems(filter) {
        // animation was off or animation is over -> reset attributes
        for (var i = 0; i < filter.items.length; i++) {
            filter.items[i].removeAttribute('style');
            Util.toggleClass(filter.items[i], 'is-hidden', !filter.filterList[i]);
            filter.items[i].removeAttribute('data-scale');
        }

        for (var i = 0; i < filter.items.length; i++) { // reorder
            filter.element.appendChild(filter.items[filter.sortingList[i][1]]);
        }

        filter.items = [];
        filter.items = filter.element.querySelectorAll('.js-filter__item');
        resetFilterSortArray(filter, false, true);
        filter.element.removeAttribute('style');
        filter.animating = false;
        if (filter.reanimate) {
            updateFilterArray(filter);
        }

        resetFallbackMessage(filter, false); // toggle fallback message

        // emit custom event - end of filtering
        filter.element.dispatchEvent(new CustomEvent('filter-selection-updated'));
    };

    function resetFilterSortArray(filter, filtering, sorting) {
        for (var i = 0; i < filter.items.length; i++) {
            if (filtering) filter.filterList[i] = true;
            if (sorting) filter.sortingList[i] = [filter.items[i], i];
        }
    };

    function createGridInfo(filter) {
        var containerWidth = parseFloat(window.getComputedStyle(filter.element).getPropertyValue('width')),
            itemStyle, itemWidth, itemHeight, marginX, marginY, colNumber;

        // get offset first visible element
        for (var i = 0; i < filter.items.length; i++) {
            if (!Util.hasClass(filter.items[i], 'is-hidden')) {
                itemStyle = window.getComputedStyle(filter.items[i]),
                    itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
                    itemHeight = parseFloat(itemStyle.getPropertyValue('height')),
                    marginX = parseFloat(itemStyle.getPropertyValue('margin-left')) + parseFloat(itemStyle.getPropertyValue('margin-right')),
                    marginY = parseFloat(itemStyle.getPropertyValue('margin-bottom')) + parseFloat(itemStyle.getPropertyValue('margin-top')),
                    colNumber = parseInt((containerWidth + marginX) / (itemWidth + marginX));
                filter.itemsGrid[0] = [filter.items[i].offsetLeft, filter.items[i].offsetTop]; // left, top
                break;
            }
        }

        for (var i = 1; i < filter.items.length; i++) {
            var x = i < colNumber ? i : i % colNumber,
                y = i < colNumber ? 0 : Math.floor(i / colNumber);
            filter.itemsGrid[i] = [filter.itemsGrid[0][0] + x * (itemWidth + marginX), filter.itemsGrid[0][1] + y * (itemHeight + marginY)];
        }
    };

    function storeOffset(filter, array) {
        for (var i = 0; i < filter.items.length; i++) {
            array[i] = [filter.items[i].offsetLeft, filter.items[i].offsetTop];
        }
    };

    function initItemsOrder(filter) {
        for (var i = 0; i < filter.items.length; i++) {
            filter.items[i].setAttribute('data-init-sort-order', i);
        }
    };

    function restoreSortOrder(filter) {
        for (var i = 0; i < filter.items.length; i++) {
            filter.sortingList[parseInt(filter.items[i].getAttribute('data-init-sort-order'))] = [filter.items[i], i];
        }
    };

    function resetFallbackMessage(filter, bool) {
        if (!filter.fallbackMessage) return;
        var show = true;
        for (var i = 0; i < filter.filterList.length; i++) {
            if (filter.filterList[i]) {
                show = false;
                break;
            }
        };
        if (bool) { // reset visibility before animation is triggered
            if (!show) Util.addClass(filter.fallbackMessage, 'is-hidden');
            return;
        }
        Util.toggleClass(filter.fallbackMessage, 'is-hidden', !show);
    };

    function getMultipleSelectValues(multipleSelect) {
        // get selected options of a <select multiple> element
        var options = multipleSelect.options,
            value = '';
        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                if (value != '') value = value + ':';
                value = value + options[i].value;
            }
        }
        return value;
    };

    Filter.defaults = {
        element: false,
        duration: 400
    };

    window.Filter = Filter;

    // init Filter object
    var filterGallery = document.getElementsByClassName('js-filter'),
        reducedMotion = Util.osHasReducedMotion();
    if (filterGallery.length > 0) {
        for (var i = 0; i < filterGallery.length; i++) {
            var duration = filterGallery[i].getAttribute('data-filter-duration');
            if (!duration) duration = Filter.defaults.duration;
            new Filter({
                element: filterGallery[i],
                duration: duration
            });
        }
    }
}());
(function () {
    var mainHeader = document.getElementsByClassName('js-header');
    if (mainHeader.length > 0) {
        var trigger = mainHeader[0].getElementsByClassName('js-header__trigger')[0],
            nav = mainHeader[0].getElementsByClassName('js-header__nav')[0];

        // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
        var focusMenu = false;

        //detect click on nav trigger
        trigger.addEventListener("click", function (event) {
            event.preventDefault();
            toggleNavigation(!Util.hasClass(nav, 'header__nav--is-visible'));
        });

        // listen for key events
        window.addEventListener('keyup', function (event) {
            // listen for esc key
            if ((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) {
                // close navigation on mobile if open
                if (trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger)) {
                    focusMenu = trigger; // move focus to menu trigger when menu is close
                    trigger.click();
                }
            }
            // listen for tab key
            if ((event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab')) {
                // close navigation on mobile if open when nav loses focus
                if (trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger) && !document.activeElement.closest('.js-header')) trigger.click();
            }
        });

        // listen for resize
        var resizingId = false;
        window.addEventListener('resize', function () {
            clearTimeout(resizingId);
            resizingId = setTimeout(doneResizing, 500);
        });

        function doneResizing() {
            if (!isVisible(trigger) && Util.hasClass(mainHeader[0], 'header--expanded')) toggleNavigation(false);
        };
    }

    function isVisible(element) {
        return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };

    function toggleNavigation(bool) { // toggle navigation visibility on small device
        Util.toggleClass(nav, 'header__nav--is-visible', bool);
        Util.toggleClass(mainHeader[0], 'header--expanded', bool);
        trigger.setAttribute('aria-expanded', bool);
        if (bool) { //opening menu -> move focus to first element inside nav
            nav.querySelectorAll('[href], input:not([disabled]), button:not([disabled])')[0].focus();
        } else if (focusMenu) {
            focusMenu.focus();
            focusMenu = false;
        }
    };
}());
// File#: _1_image-zoom
// Usage: codyhouse.co/license

(function() {
  var ImageZoom = function(element, index) {
    this.element = element;
    this.lightBoxId = 'img-zoom-lightbox--'+index;
    this.imgPreview = this.element.getElementsByClassName('js-image-zoom__preview')[0];
    
    initImageZoomHtml(this); // init markup
    
    this.lightbox = document.getElementById(this.lightBoxId);
    this.imgEnlg = this.lightbox.getElementsByClassName('js-image-zoom__fw')[0];
    this.input = this.element.getElementsByClassName('js-image-zoom__input')[0];
    this.animate = this.element.getAttribute('data-morph') != 'off';
    
    initImageZoomEvents(this); //init events
  };

  function initImageZoomHtml(imageZoom) {
    // get zoomed image url
    var url = imageZoom.element.getAttribute('data-img');
    if(!url) url = imageZoom.imgPreview.getAttribute('src');

    var lightBox = document.createElement('div');
    Util.setAttributes(lightBox, {class: 'image-zoom__lightbox js-image-zoom__lightbox', id: imageZoom.lightBoxId, 'aria-hidden': 'true'});
    lightBox.innerHTML = '<img src="'+url+'" class="js-image-zoom__fw"></img>';
    document.body.appendChild(lightBox);
    
    var keyboardInput = '<input aria-hidden="true" type="checkbox" class="image-zoom__input js-image-zoom__input"></input>';
    imageZoom.element.insertAdjacentHTML('afterbegin', keyboardInput);

  };

  function initImageZoomEvents(imageZoom) {
    // toggle lightbox on click
    imageZoom.imgPreview.addEventListener('click', function(event){
      toggleFullWidth(imageZoom, true);
      imageZoom.input.checked = true;
    });
    imageZoom.lightbox.addEventListener('click', function(event){
      toggleFullWidth(imageZoom, false);
      imageZoom.input.checked = false;
    });
    // keyboard accessibility
    imageZoom.input.addEventListener('change', function(event){
      toggleFullWidth(imageZoom, imageZoom.input.checked);
    });
    imageZoom.input.addEventListener('keydown', function(event){
      if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
        imageZoom.input.checked = !imageZoom.input.checked;
        toggleFullWidth(imageZoom, imageZoom.input.checked);
      }
    });
  };

  function toggleFullWidth(imageZoom, bool) {
    if(animationSupported && imageZoom.animate) { // start expanding animation
      window.requestAnimationFrame(function(){
        animateZoomImage(imageZoom, bool);
      });
    } else { // show lightbox without animation
      Util.toggleClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible', bool);
    }
  };

  function animateZoomImage(imageZoom, bool) {
    // get img preview position and dimension for the morphing effect
    var rect = imageZoom.imgPreview.getBoundingClientRect(),
      finalWidth = imageZoom.lightbox.getBoundingClientRect().width;
    var init = (bool) ? [rect.top, rect.left, rect.width] : [0, 0, finalWidth],
      final = (bool) ? [-rect.top, -rect.left, parseFloat(finalWidth/rect.width)] : [rect.top + imageZoom.lightbox.scrollTop, rect.left, parseFloat(rect.width/finalWidth)];
    
    if(bool) {
      imageZoom.imgEnlg.setAttribute('style', 'top: '+init[0]+'px; left:'+init[1]+'px; width:'+init[2]+'px;');
    }
    
    // show modal
    Util.removeClass(imageZoom.lightbox, 'image-zoom__lightbox--no-transition');
    Util.addClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible');

    imageZoom.imgEnlg.addEventListener('transitionend', function cb(event){ // reset elements once animation is over
      if(!bool) Util.removeClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible');
      Util.addClass(imageZoom.lightbox, 'image-zoom__lightbox--no-transition');
      imageZoom.imgEnlg.removeAttribute('style');
      imageZoom.imgEnlg.removeEventListener('transitionend', cb);
    });
    
    // animate image and bg
    imageZoom.imgEnlg.style.transform = 'translateX('+final[1]+'px) translateY('+final[0]+'px) scale('+final[2]+')';
    Util.toggleClass(imageZoom.lightbox, 'image-zoom__lightbox--animate-bg', bool);
  };

  // init ImageZoom object
  var imageZoom = document.getElementsByClassName('js-image-zoom'),
    animationSupported = window.requestAnimationFrame && !Util.osHasReducedMotion();
  if( imageZoom.length > 0 ) {
    var imageZoomArray = [];
    for( var i = 0; i < imageZoom.length; i++) {
      imageZoomArray.push(new ImageZoom(imageZoom[i], i));
    }

    // close Zoom Image lightbox on Esc
    window.addEventListener('keydown', function(event){
      if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'esc')) {
        for( var i = 0; i < imageZoomArray.length; i++) {
          imageZoomArray[i].input.checked = false;
          if(Util.hasClass(imageZoomArray[i].lightbox, 'image-zoom__lightbox--is-visible')) toggleFullWidth(imageZoomArray[i], false);
        }
      }
    });
  }
}());
// File#: _1_lazy-load
// Usage: codyhouse.co/license
(function() {
  var LazyLoad = function(elements) {
    this.elements = elements;
    initLazyLoad(this);
  };

  function initLazyLoad(asset) {
    if(lazySupported) setAssetsSrc(asset);
    else if(intersectionObsSupported) observeAssets(asset);
    else scrollAsset(asset);
  };

  function setAssetsSrc(asset) {
    for(var i = 0; i < asset.elements.length; i++) {
      if(asset.elements[i].getAttribute('data-bg') || asset.elements[i].tagName.toLowerCase() == 'picture') { // this could be an element with a bg image or a <source> element inside a <picture>
        observeSingleAsset(asset.elements[i]);
      } else {
        setSingleAssetSrc(asset.elements[i]);
      } 
    }
  };

  function setSingleAssetSrc(img) {
    if(img.tagName.toLowerCase() == 'picture') {
      setPictureSrc(img);
    } else {
      setSrcSrcset(img);
      var bg = img.getAttribute('data-bg');
      if(bg) img.style.backgroundImage = bg;
      if(!lazySupported || bg) img.removeAttribute("loading");
    }
  };

  function setPictureSrc(picture) {
    var pictureChildren = picture.children;
    for(var i = 0; i < pictureChildren.length; i++) setSrcSrcset(pictureChildren[i]);
    picture.removeAttribute("loading");
  };

  function setSrcSrcset(img) {
    var src = img.getAttribute('data-src');
    if(src) img.src = src;
    var srcset = img.getAttribute('data-srcset');
    if(srcset) img.srcset = srcset;
  };

  function observeAssets(asset) {
    for(var i = 0; i < asset.elements.length; i++) {
      observeSingleAsset(asset.elements[i]);
    }
  };

  function observeSingleAsset(img) {
    if( !img.getAttribute('data-src') && !img.getAttribute('data-srcset') && !img.getAttribute('data-bg') && img.tagName.toLowerCase() != 'picture') return; // using the native lazyload with no need js lazy-loading

    var threshold = img.getAttribute('data-threshold') || '200px';
    var config = {rootMargin: threshold};
    var observer = new IntersectionObserver(observerLoadContent.bind(img), config);
    observer.observe(img);
  };

  function observerLoadContent(entries, observer) { 
    if(entries[0].isIntersecting) {
      setSingleAssetSrc(this);
      observer.unobserve(this);
    }
  };

  function scrollAsset(asset) {
    asset.elements = Array.prototype.slice.call(asset.elements);
    asset.listening = false;
    asset.scrollListener = eventLazyLoad.bind(asset);
    document.addEventListener("scroll", asset.scrollListener);
    asset.resizeListener = eventLazyLoad.bind(asset);
    document.addEventListener("resize", asset.resizeListener);
    eventLazyLoad.bind(asset)(); // trigger before starting scrolling/resizing
  };

  function eventLazyLoad() {
    var self = this;
    if(self.listening) return;
    self.listening = true;
    setTimeout(function() {
      for(var i = 0; i < self.elements.length; i++) {
        if ((self.elements[i].getBoundingClientRect().top <= window.innerHeight && self.elements[i].getBoundingClientRect().bottom >= 0) && getComputedStyle(self.elements[i]).display !== "none") {
          setSingleAssetSrc(self.elements[i]);

          self.elements = self.elements.filter(function(image) {
            return image.hasAttribute("loading");
          });

          if (self.elements.length === 0) {
            if(self.scrollListener) document.removeEventListener("scroll", self.scrollListener);
            if(self.resizeListener) window.removeEventListener("resize", self.resizeListener);
          }
        }
      }
      self.listening = false;
    }, 200);
  };

  window.LazyLoad = LazyLoad;

  var lazyLoads = document.querySelectorAll('[loading="lazy"]'),
    lazySupported = 'loading' in HTMLImageElement.prototype,
    intersectionObsSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  
  if( lazyLoads.length > 0 ) {
    new LazyLoad(lazyLoads);
  };
  
}());
// File#: _1_number-input
// Usage: codyhouse.co/license
(function() {
	var InputNumber = function(element) {
		this.element = element;
		this.input = this.element.getElementsByClassName('js-number-input__value')[0];
		this.min = parseFloat(this.input.getAttribute('min'));
		this.max = parseFloat(this.input.getAttribute('max'));
		this.step = parseFloat(this.input.getAttribute('step'));
		if(isNaN(this.step)) this.step = 1;
		this.precision = getStepPrecision(this.step);
		initInputNumberEvents(this);
	};

	function initInputNumberEvents(input) {
		// listen to the click event on the custom increment buttons
		input.element.addEventListener('click', function(event){ 
			var increment = event.target.closest('.js-number-input__btn');
			if(increment) {
				event.preventDefault();
				updateInputNumber(input, increment);
			}
		});

		// when input changes, make sure the new value is acceptable
		input.input.addEventListener('focusout', function(event){
			var value = parseFloat(input.input.value);
			if( value < input.min ) value = input.min;
			if( value > input.max ) value = input.max;
			// check value is multiple of step
			value = checkIsMultipleStep(input, value);
			if( value != parseFloat(input.input.value)) input.input.value = value;

		});
	};

	function getStepPrecision(step) {
		// if step is a floating number, return its precision
		return (step.toString().length - Math.floor(step).toString().length - 1);
	};

	function updateInputNumber(input, btn) {
		var value = ( Util.hasClass(btn, 'number-input__btn--plus') ) ? parseFloat(input.input.value) + input.step : parseFloat(input.input.value) - input.step;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		if( value < input.min ) value = input.min;
		if( value > input.max ) value = input.max;
		input.input.value = value;
		input.input.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
	};

	function checkIsMultipleStep(input, value) {
		// check if the number inserted is a multiple of the step value
		var remain = (value*10*input.precision)%(input.step*10*input.precision);
		if( remain != 0) value = value - remain;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		return value;
	};

	//initialize the InputNumber objects
	var inputNumbers = document.getElementsByClassName('js-number-input');
	if( inputNumbers.length > 0 ) {
		for( var i = 0; i < inputNumbers.length; i++) {
			(function(i){new InputNumber(inputNumbers[i]);})(i);
		}
	}
}());
// File#: _1_rating
// Usage: codyhouse.co/license
(function() {
	var Rating = function(element) {
		this.element = element;
		this.icons = this.element.getElementsByClassName('js-rating__control')[0];
		this.iconCode = this.icons.children[0].parentNode.innerHTML;
		this.initialRating = [];
		this.initialRatingElement = this.element.getElementsByClassName('js-rating__value')[0];
		this.ratingItems;
		this.selectedRatingItem;
    this.readOnly = Util.hasClass(this.element, 'js-rating--read-only');
		this.ratingMaxValue = 5;
		this.getInitialRating();
		this.initRatingHtml();
	};

	Rating.prototype.getInitialRating = function() {
		// get the rating of the product
		if(!this.initialRatingElement || !this.readOnly) {
			this.initialRating = [0, false];
			return;
		}

		var initialValue = Number(this.initialRatingElement.textContent);
		if(isNaN(initialValue)) {
			this.initialRating = [0, false];
			return;
		}

		var floorNumber = Math.floor(initialValue);
		this.initialRating[0] = (floorNumber < initialValue) ? floorNumber + 1 : floorNumber;
		this.initialRating[1] = (floorNumber < initialValue) ? Math.round((initialValue - floorNumber)*100) : false;
	};

	Rating.prototype.initRatingHtml = function() {
		//create the star elements
		var iconsList = this.readOnly ? '<ul>' : '<ul role="radiogroup">';
		
		//if initial rating value is zero -> add a 'zero' item 
		if(this.initialRating[0] == 0 && !this.initialRating[1]) {
			iconsList = iconsList+ '<li class="rating__item--zero rating__item--checked"></li>';
		}

		// create the stars list 
		for(var i = 0; i < this.ratingMaxValue; i++) { 
			iconsList = iconsList + this.getStarHtml(i);
		}
		iconsList = iconsList + '</ul>';

		// --default variation only - improve SR accessibility including a legend element 
		if(!this.readOnly) {
			var labelElement = this.element.getElementsByTagName('label');
			if(labelElement.length > 0) {
				var legendElement = '<legend class="'+labelElement[0].getAttribute('class')+'">'+labelElement[0].textContent+'</legend>';
				iconsList = '<fieldset>'+legendElement+iconsList+'</fieldset>';
				Util.addClass(labelElement[0], 'is-hidden');
			}
		}

		this.icons.innerHTML = iconsList;
		
		//init object properties
		this.ratingItems = this.icons.getElementsByClassName('js-rating__item');
		this.selectedRatingItem = this.icons.getElementsByClassName('rating__item--checked')[0];

		//show the stars
		Util.removeClass(this.icons, 'rating__control--is-hidden');

		//event listener
		!this.readOnly && this.initRatingEvents();// rating vote enabled
	};

	Rating.prototype.getStarHtml = function(index) {
		var listItem = '';
		var checked = (index+1 == this.initialRating[0]) ? true : false,
			itemClass = checked ? ' rating__item--checked' : '',
			tabIndex = (checked || (this.initialRating[0] == 0 && !this.initialRating[1] && index == 0) ) ? 0 : -1,
			showHalf = checked && this.initialRating[1] ? true : false,
			iconWidth = showHalf ? ' rating__item--half': '';
		if(!this.readOnly) {
			listItem = '<li class="js-rating__item'+itemClass+iconWidth+'" role="radio" aria-label="'+(index+1)+'" aria-checked="'+checked+'" tabindex="'+tabIndex+'"><div class="rating__icon">'+this.iconCode+'</div></li>';
		} else {
			var starInner = showHalf ? '<div class="rating__icon">'+this.iconCode+'</div><div class="rating__icon rating__icon--inactive">'+this.iconCode+'</div>': '<div class="rating__icon">'+this.iconCode+'</div>';
			listItem = '<li class="js-rating__item'+itemClass+iconWidth+'">'+starInner+'</li>';
		}
		return listItem;
	};

	Rating.prototype.initRatingEvents = function() {
		var self = this;

		//click on a star
		this.icons.addEventListener('click', function(event){
			var trigger = event.target.closest('.js-rating__item');
			self.resetSelectedIcon(trigger);
		});

		//keyboard navigation -> select new star
		this.icons.addEventListener('keydown', function(event){
			if( event.keyCode && (event.keyCode == 39 || event.keyCode == 40 ) || event.key && (event.key.toLowerCase() == 'arrowright' || event.key.toLowerCase() == 'arrowdown') ) {
				self.selectNewIcon('next'); //select next star on arrow right/down
			} else if(event.keyCode && (event.keyCode == 37 || event.keyCode == 38 ) || event.key && (event.key.toLowerCase() == 'arrowleft' || event.key.toLowerCase() == 'arrowup')) {
				self.selectNewIcon('prev'); //select prev star on arrow left/up
			} else if(event.keyCode && event.keyCode == 32 || event.key && event.key == ' ') {
				self.selectFocusIcon(); // select focused star on Space
			}
		});
	};

	Rating.prototype.selectNewIcon = function(direction) {
		var index = Util.getIndexInArray(this.ratingItems, this.selectedRatingItem);
		index = (direction == 'next') ? index + 1 : index - 1;
		if(index < 0) index = this.ratingItems.length - 1;
		if(index >= this.ratingItems.length) index = 0;	
		this.resetSelectedIcon(this.ratingItems[index]);
		this.ratingItems[index].focus();
	};

	Rating.prototype.selectFocusIcon = function(direction) {
		this.resetSelectedIcon(document.activeElement);
	};

	Rating.prototype.resetSelectedIcon = function(trigger) {
		if(!trigger) return;
		Util.removeClass(this.selectedRatingItem, 'rating__item--checked');
		Util.setAttributes(this.selectedRatingItem, {'aria-checked': false, 'tabindex': -1});
		Util.addClass(trigger, 'rating__item--checked');
		Util.setAttributes(trigger, {'aria-checked': true, 'tabindex': 0});
		this.selectedRatingItem = trigger; 
		// update select input value
		var select = this.element.getElementsByTagName('select');
		if(select.length > 0) {
			select[0].value = trigger.getAttribute('aria-label');
		}
	};
	
	//initialize the Rating objects
	var ratings = document.getElementsByClassName('js-rating');
	if( ratings.length > 0 ) {
		for( var i = 0; i < ratings.length; i++) {
			(function(i){new Rating(ratings[i]);})(i);
		}
	};
}());
// File#: _1_reveal-effects
// Usage: codyhouse.co/license
(function() {
	var fxElements = document.getElementsByClassName('reveal-fx');
	var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(fxElements.length > 0) {
		// deactivate effect if Reduced Motion is enabled
		if (Util.osHasReducedMotion() || !intersectionObserverSupported) {
			fxRemoveClasses();
			return;
		}
		//on small devices, do not animate elements -> reveal all
		if( fxDisabled(fxElements[0]) ) {
			fxRevealAll();
			return;
		}

		var fxRevealDelta = 120; // amount (in pixel) the element needs to enter the viewport to be revealed - if not custom value (data-reveal-fx-delta)
		
		var viewportHeight = window.innerHeight,
			fxChecking = false,
			fxRevealedItems = [],
			fxElementDelays = fxGetDelays(), //elements animation delay
			fxElementDeltas = fxGetDeltas(); // amount (in px) the element needs enter the viewport to be revealed (default value is fxRevealDelta) 
		
		
		// add event listeners
		window.addEventListener('load', fxReveal);
		window.addEventListener('resize', fxResize);

		// observe reveal elements
		var observer = [];
		initObserver();

		function initObserver() {
			for(var i = 0; i < fxElements.length; i++) {
				observer[i] = new IntersectionObserver(
					function(entries, observer) { 
						if(entries[0].isIntersecting) {
							fxRevealItemObserver(entries[0].target);
							observer.unobserve(entries[0].target);
						}
					}, 
					{rootMargin: "0px 0px -"+fxElementDeltas[i]+"px 0px"}
				);
	
				observer[i].observe(fxElements[i]);
			}
		};

		function fxRevealAll() { // reveal all elements - small devices
			for(var i = 0; i < fxElements.length; i++) {
				Util.addClass(fxElements[i], 'reveal-fx--is-visible');
			}
		};

		function fxResize() { // on resize - check new window height and reveal visible elements
			if(fxChecking) return;
			fxChecking = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){fxReset();}, 250) : window.requestAnimationFrame(fxReset);
		};

		function fxReset() {
			viewportHeight = window.innerHeight;
			fxReveal();
		};

		function fxReveal() { // reveal visible elements
			for(var i = 0; i < fxElements.length; i++) {(function(i){
				if(fxRevealedItems.indexOf(i) != -1 ) return; //element has already been revelead
				if(fxElementIsVisible(fxElements[i], i)) {
					fxRevealItem(i);
					fxRevealedItems.push(i);
				}})(i); 
			}
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxRevealItem(index) {
			if(fxElementDelays[index] && fxElementDelays[index] != 0) {
				// wait before revealing element if a delay was added
				setTimeout(function(){
					Util.addClass(fxElements[index], 'reveal-fx--is-visible');
				}, fxElementDelays[index]);
			} else {
				Util.addClass(fxElements[index], 'reveal-fx--is-visible');
			}
		};

		function fxRevealItemObserver(item) {
			var index = Util.getIndexInArray(fxElements, item);
			if(fxRevealedItems.indexOf(index) != -1 ) return; //element has already been revelead
			fxRevealItem(index);
			fxRevealedItems.push(index);
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxGetDelays() { // get anmation delays
			var delays = [];
			for(var i = 0; i < fxElements.length; i++) {
				delays.push( fxElements[i].getAttribute('data-reveal-fx-delay') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delay')) : 0);
			}
			return delays;
		};

		function fxGetDeltas() { // get reveal delta
			var deltas = [];
			for(var i = 0; i < fxElements.length; i++) {
				deltas.push( fxElements[i].getAttribute('data-reveal-fx-delta') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delta')) : fxRevealDelta);
			}
			return deltas;
		};

		function fxDisabled(element) { // check if elements need to be animated - no animation on small devices
			return !(window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/'|"/g, "") == 'reveal-fx');
		};

		function fxElementIsVisible(element, i) { // element is inside viewport
			return (fxGetElementPosition(element) <= viewportHeight - fxElementDeltas[i]);
		};

		function fxGetElementPosition(element) { // get top position of element
			return element.getBoundingClientRect().top;
		};

		function fxResetEvents() { 
			if(fxElements.length > fxRevealedItems.length) return;
			// remove event listeners if all elements have been revealed
			window.removeEventListener('load', fxReveal);
			window.removeEventListener('resize', fxResize);
		};

		function fxRemoveClasses() {
			// Reduced Motion on or Intersection Observer not supported
			while(fxElements[0]) {
				// remove all classes starting with 'reveal-fx--'
				var classes = fxElements[0].className.split(" ").filter(function(c) {
					return c.lastIndexOf('reveal-fx--', 0) !== 0;
				});
				fxElements[0].className = classes.join(" ").trim();
				Util.removeClass(fxElements[0], 'reveal-fx');
			}
		};
	}
}());
// File#: _1_smooth-scrolling
// Usage: codyhouse.co/license
(function() {
	var SmoothScroll = function(element) {
		this.element = element;
		this.scrollDuration = parseInt(this.element.getAttribute('data-duration')) || 300;
		this.dataElement = this.element.getAttribute('data-scrollable-element') || this.element.getAttribute('data-element');
		this.scrollElement = this.dataElement ? document.querySelector(this.dataElement) : window;
		this.initScroll();
	};

	SmoothScroll.prototype.initScroll = function() {
		var self = this;

		//detect click on link
		this.element.addEventListener('click', function(event){
			event.preventDefault();
			var targetId = event.target.closest('.js-smooth-scroll').getAttribute('href').replace('#', ''),
				target = document.getElementById(targetId),
				targetTabIndex = target.getAttribute('tabindex'),
				windowScrollTop = self.scrollElement.scrollTop || document.documentElement.scrollTop;

			if(!self.dataElement) windowScrollTop = window.scrollY || document.documentElement.scrollTop;

			var scrollElement = self.dataElement ? self.scrollElement : false;

			var fixedHeight = self.getFixedElementHeight(); // check if there's a fixed element on the page
			Util.scrollTo(target.getBoundingClientRect().top + windowScrollTop - fixedHeight, self.scrollDuration, function() {
				//move the focus to the target element - don't break keyboard navigation
				Util.moveFocus(target);
				history.pushState(false, false, '#'+targetId);
				self.resetTarget(target, targetTabIndex);
			}, scrollElement);
		});
	};

	SmoothScroll.prototype.resetTarget = function(target, tabindex) {
		if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}	
	};

	SmoothScroll.prototype.getFixedElementHeight = function() {
		var fixedElementDelta = parseInt(getComputedStyle(document.documentElement).getPropertyValue('scroll-padding'));
		if(isNaN(fixedElementDelta) ) { // scroll-padding not supported
			fixedElementDelta = 0;
			var fixedElement = document.querySelector(this.element.getAttribute('data-fixed-element'));
			if(fixedElement) fixedElementDelta = parseInt(fixedElement.getBoundingClientRect().height);
		}
		return fixedElementDelta;
	};
	
	//initialize the Smooth Scroll objects
	var smoothScrollLinks = document.getElementsByClassName('js-smooth-scroll');
	if( smoothScrollLinks.length > 0 && !Util.cssSupports('scroll-behavior', 'smooth') && window.requestAnimationFrame) {
		// you need javascript only if css scroll-behavior is not supported
		for( var i = 0; i < smoothScrollLinks.length; i++) {
			(function(i){new SmoothScroll(smoothScrollLinks[i]);})(i);
		}
	}
}());
// File#: _1_swipe-content
(function() {
	var SwipeContent = function(element) {
		this.element = element;
		this.delta = [false, false];
		this.dragging = false;
		this.intervalId = false;
		initSwipeContent(this);
	};

	function initSwipeContent(content) {
		content.element.addEventListener('mousedown', handleEvent.bind(content));
		content.element.addEventListener('touchstart', handleEvent.bind(content));
	};

	function initDragging(content) {
		//add event listeners
		content.element.addEventListener('mousemove', handleEvent.bind(content));
		content.element.addEventListener('touchmove', handleEvent.bind(content));
		content.element.addEventListener('mouseup', handleEvent.bind(content));
		content.element.addEventListener('mouseleave', handleEvent.bind(content));
		content.element.addEventListener('touchend', handleEvent.bind(content));
	};

	function cancelDragging(content) {
		//remove event listeners
		if(content.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
			content.intervalId = false;
		}
		content.element.removeEventListener('mousemove', handleEvent.bind(content));
		content.element.removeEventListener('touchmove', handleEvent.bind(content));
		content.element.removeEventListener('mouseup', handleEvent.bind(content));
		content.element.removeEventListener('mouseleave', handleEvent.bind(content));
		content.element.removeEventListener('touchend', handleEvent.bind(content));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'mousedown':
			case 'touchstart':
				startDrag(this, event);
				break;
			case 'mousemove':
			case 'touchmove':
				drag(this, event);
				break;
			case 'mouseup':
			case 'mouseleave':
			case 'touchend':
				endDrag(this, event);
				break;
		}
	};

	function startDrag(content, event) {
		content.dragging = true;
		// listen to drag movements
		initDragging(content);
		content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
		// emit drag start event
		emitSwipeEvents(content, 'dragStart', content.delta, event.target);
	};

	function endDrag(content, event) {
		cancelDragging(content);
		// credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
		var dx = parseInt(unify(event).clientX), 
	    dy = parseInt(unify(event).clientY);
	  
	  // check if there was a left/right swipe
		if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
	    var s = getSign(dx - content.delta[0]);
			
			if(Math.abs(dx - content.delta[0]) > 30) {
				(s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
			}
	    
	    content.delta[0] = false;
	  }
		// check if there was a top/bottom swipe
	  if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
	  	var y = getSign(dy - content.delta[1]);

	  	if(Math.abs(dy - content.delta[1]) > 30) {
	    	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
	    }

	    content.delta[1] = false;
	  }
		// emit drag end event
	  emitSwipeEvents(content, 'dragEnd', [dx, dy]);
	  content.dragging = false;
	};

	function drag(content, event) {
		if(!content.dragging) return;
		// emit dragging event with coordinates
		(!window.requestAnimationFrame) 
			? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
			: content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
	};

	function emitDrag(event) {
		emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
	};

	function unify(event) { 
		// unify mouse and touch events
		return event.changedTouches ? event.changedTouches[0] : event; 
	};

	function emitSwipeEvents(content, eventName, detail, el) {
		var trigger = false;
		if(el) trigger = el;
		// emit event with coordinates
		var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
		content.element.dispatchEvent(event);
	};

	function getSign(x) {
		if(!Math.sign) {
			return ((x > 0) - (x < 0)) || +x;
		} else {
			return Math.sign(x);
		}
	};

	window.SwipeContent = SwipeContent;
	
	//initialize the SwipeContent objects
	var swipe = document.getElementsByClassName('js-swipe-content');
	if( swipe.length > 0 ) {
		for( var i = 0; i < swipe.length; i++) {
			(function(i){new SwipeContent(swipe[i]);})(i);
		}
	}
}());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
  var flexHeader = document.getElementsByClassName('js-f-header');
	if(flexHeader.length > 0) {
		var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
			toggleMenuNavigation(event.detail);
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function getMenuFirstFocusable() {
			var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
		};

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
				menuTrigger.click();
			}
		};
		
		function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
			Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
			Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
			menuTrigger.setAttribute('aria-expanded', bool);
			if(bool) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		};
	}
}());
(function () {
    var Slideshow = function (opts) {
        this.options = slideshowAssignOptions(Slideshow.defaults, opts);
        this.element = this.options.element;
        this.items = this.element.getElementsByClassName('js-slideshow__item');
        this.controls = this.element.getElementsByClassName('js-slideshow__control');
        this.selectedSlide = 0;
        this.autoplayId = false;
        this.autoplayPaused = false;
        this.navigation = false;
        this.navCurrentLabel = false;
        this.ariaLive = false;
        this.moveFocus = false;
        this.animating = false;
        this.supportAnimation = Util.cssSupports('transition');
        this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
        this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
        this.animatingClass = 'slideshow--is-animating';
        initSlideshow(this);
        initSlideshowEvents(this);
        initAnimationEndEvents(this);
    };

    Slideshow.prototype.showNext = function () {
        showNewItem(this, this.selectedSlide + 1, 'next');
    };

    Slideshow.prototype.showPrev = function () {
        showNewItem(this, this.selectedSlide - 1, 'prev');
    };

    Slideshow.prototype.showItem = function (index) {
        showNewItem(this, index, false);
    };

    Slideshow.prototype.startAutoplay = function () {
        var self = this;
        if (this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
            self.autoplayId = setInterval(function () {
                self.showNext();
            }, self.options.autoplayInterval);
        }
    };

    Slideshow.prototype.pauseAutoplay = function () {
        var self = this;
        if (this.options.autoplay) {
            clearInterval(self.autoplayId);
            self.autoplayId = false;
        }
    };

    function slideshowAssignOptions(defaults, opts) {
        // initialize the object options
        var mergeOpts = {};
        mergeOpts.element = (typeof opts.element !== "undefined") ? opts.element : defaults.element;
        mergeOpts.navigation = (typeof opts.navigation !== "undefined") ? opts.navigation : defaults.navigation;
        mergeOpts.autoplay = (typeof opts.autoplay !== "undefined") ? opts.autoplay : defaults.autoplay;
        mergeOpts.autoplayInterval = (typeof opts.autoplayInterval !== "undefined") ? opts.autoplayInterval : defaults.autoplayInterval;
        mergeOpts.swipe = (typeof opts.swipe !== "undefined") ? opts.swipe : defaults.swipe;
        return mergeOpts;
    };

    function initSlideshow(slideshow) { // basic slideshow settings
        // if no slide has been selected -> select the first one
        if (slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
        slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
        // create an element that will be used to announce the new visible slide to SR
        var srLiveArea = document.createElement('div');
        Util.setAttributes(srLiveArea, {
            'class': 'sr-only js-slideshow__aria-live',
            'aria-live': 'polite',
            'aria-atomic': 'true'
        });
        slideshow.element.appendChild(srLiveArea);
        slideshow.ariaLive = srLiveArea;
    };

    function initSlideshowEvents(slideshow) {
        // if slideshow navigation is on -> create navigation HTML and add event listeners
        if (slideshow.options.navigation) {
            // check if navigation has already been included
            if (slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
                var navigation = document.createElement('ol'),
                    navChildren = '';

                var navClasses = 'slideshow__navigation js-slideshow__navigation';
                if (slideshow.items.length <= 1) {
                    navClasses = navClasses + ' is-hidden';
                }

                navigation.setAttribute('class', navClasses);
                for (var i = 0; i < slideshow.items.length; i++) {
                    var className = (i == slideshow.selectedSlide) ? 'class="slideshow__nav-item slideshow__nav-item--selected js-slideshow__nav-item"' : 'class="slideshow__nav-item js-slideshow__nav-item"',
                        navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
                    navChildren = navChildren + '<li ' + className + '><button class="reset"><span class="sr-only">' + (i + 1) + '</span>' + navCurrentLabel + '</button></li>';
                }
                navigation.innerHTML = navChildren;
                slideshow.element.appendChild(navigation);
            }

            slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0];
            slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');

            var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];

            dotsNavigation.addEventListener('click', function (event) {
                navigateSlide(slideshow, event, true);
            });
            dotsNavigation.addEventListener('keyup', function (event) {
                navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
            });
        }
        // slideshow arrow controls
        if (slideshow.controls.length > 0) {
            // hide controls if one item available
            if (slideshow.items.length <= 1) {
                Util.addClass(slideshow.controls[0], 'is-hidden');
                Util.addClass(slideshow.controls[1], 'is-hidden');
            }
            slideshow.controls[0].addEventListener('click', function (event) {
                event.preventDefault();
                slideshow.showPrev();
                updateAriaLive(slideshow);
            });
            slideshow.controls[1].addEventListener('click', function (event) {
                event.preventDefault();
                slideshow.showNext();
                updateAriaLive(slideshow);
            });
        }
        // swipe events
        if (slideshow.options.swipe) {
            //init swipe
            new SwipeContent(slideshow.element);
            slideshow.element.addEventListener('swipeLeft', function (event) {
                slideshow.showNext();
            });
            slideshow.element.addEventListener('swipeRight', function (event) {
                slideshow.showPrev();
            });
        }
        // autoplay
        if (slideshow.options.autoplay) {
            slideshow.startAutoplay();
            // pause autoplay if user is interacting with the slideshow
            slideshow.element.addEventListener('mouseenter', function (event) {
                slideshow.pauseAutoplay();
                slideshow.autoplayPaused = true;
            });
            slideshow.element.addEventListener('focusin', function (event) {
                slideshow.pauseAutoplay();
                slideshow.autoplayPaused = true;
            });
            slideshow.element.addEventListener('mouseleave', function (event) {
                slideshow.autoplayPaused = false;
                slideshow.startAutoplay();
            });
            slideshow.element.addEventListener('focusout', function (event) {
                slideshow.autoplayPaused = false;
                slideshow.startAutoplay();
            });
        }
        // detect if external buttons control the slideshow
        var slideshowId = slideshow.element.getAttribute('id');
        if (slideshowId) {
            var externalControls = document.querySelectorAll('[data-controls="' + slideshowId + '"]');
            for (var i = 0; i < externalControls.length; i++) {
                (function (i) {
                    externalControlSlide(slideshow, externalControls[i]);
                })(i);
            }
        }
        // custom event to trigger selection of a new slide element
        slideshow.element.addEventListener('selectNewItem', function (event) {
            // check if slide is already selected
            if (event.detail) {
                if (event.detail - 1 == slideshow.selectedSlide) return;
                showNewItem(slideshow, event.detail - 1, false);
            }
        });
    };

    function navigateSlide(slideshow, event, keyNav) {
        // user has interacted with the slideshow navigation -> update visible slide
        var target = (Util.hasClass(event.target, 'js-slideshow__nav-item')) ? event.target : event.target.closest('.js-slideshow__nav-item');
        if (keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
            slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
            slideshow.moveFocus = true;
            updateAriaLive(slideshow);
        }
    };

    function initAnimationEndEvents(slideshow) {
        // remove animation classes at the end of a slide transition
        for (var i = 0; i < slideshow.items.length; i++) {
            (function (i) {
                slideshow.items[i].addEventListener('animationend', function () {
                    resetAnimationEnd(slideshow, slideshow.items[i]);
                });
                slideshow.items[i].addEventListener('transitionend', function () {
                    resetAnimationEnd(slideshow, slideshow.items[i]);
                });
            })(i);
        }
    };

    function resetAnimationEnd(slideshow, item) {
        setTimeout(function () { // add a delay between the end of animation and slideshow reset - improve animation performance
            if (Util.hasClass(item, 'slideshow__item--selected')) {
                if (slideshow.moveFocus) Util.moveFocus(item);
                emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
                slideshow.moveFocus = false;
            }
            Util.removeClass(item, 'slideshow__item--' + slideshow.animationType + '-out-left slideshow__item--' + slideshow.animationType + '-out-right slideshow__item--' + slideshow.animationType + '-in-left slideshow__item--' + slideshow.animationType + '-in-right');
            item.removeAttribute('aria-hidden');
            slideshow.animating = false;
            Util.removeClass(slideshow.element, slideshow.animatingClass);
        }, 100);
    };

    function showNewItem(slideshow, index, bool) {
        if (slideshow.items.length <= 1) return;
        if (slideshow.animating && slideshow.supportAnimation) return;
        slideshow.animating = true;
        Util.addClass(slideshow.element, slideshow.animatingClass);
        if (index < 0) index = slideshow.items.length - 1;
        else if (index >= slideshow.items.length) index = 0;
        // skip slideshow item if it is hidden
        if (bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
            slideshow.animating = false;
            index = bool == 'next' ? index + 1 : index - 1;
            showNewItem(slideshow, index, bool);
            return;
        }
        // index of new slide is equal to index of slide selected item
        if (index == slideshow.selectedSlide) {
            slideshow.animating = false;
            return;
        }
        var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
        var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
        // transition between slides
        if (!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
        Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
        slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
        if (slideshow.animationOff) {
            Util.addClass(slideshow.items[index], 'slideshow__item--selected');
        } else {
            Util.addClass(slideshow.items[index], enterItemClass + ' slideshow__item--selected');
        }
        // reset slider navigation appearance
        resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
        slideshow.selectedSlide = index;
        // reset autoplay
        slideshow.pauseAutoplay();
        slideshow.startAutoplay();
        // reset controls/navigation color themes
        resetSlideshowTheme(slideshow, index);
        // emit event
        emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
        if (slideshow.animationOff) {
            slideshow.animating = false;
            Util.removeClass(slideshow.element, slideshow.animatingClass);
        }
    };

    function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
        var className = '';
        if (bool) {
            className = (bool == 'next') ? 'slideshow__item--' + slideshow.animationType + '-out-right' : 'slideshow__item--' + slideshow.animationType + '-out-left';
        } else {
            className = (newIndex < oldIndex) ? 'slideshow__item--' + slideshow.animationType + '-out-left' : 'slideshow__item--' + slideshow.animationType + '-out-right';
        }
        return className;
    };

    function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
        var className = '';
        if (bool) {
            className = (bool == 'next') ? 'slideshow__item--' + slideshow.animationType + '-in-right' : 'slideshow__item--' + slideshow.animationType + '-in-left';
        } else {
            className = (newIndex < oldIndex) ? 'slideshow__item--' + slideshow.animationType + '-in-left' : 'slideshow__item--' + slideshow.animationType + '-in-right';
        }
        return className;
    };

    function resetSlideshowNav(slideshow, newIndex, oldIndex) {
        if (slideshow.navigation) {
            Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
            Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
            slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
            slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
        }
    };

    function resetSlideshowTheme(slideshow, newIndex) {
        var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
        if (dataTheme) {
            if (slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
            if (slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
        } else {
            if (slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
            if (slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
        }
    };

    function emitSlideshowEvent(slideshow, eventName, detail) {
        var event = new CustomEvent(eventName, {
            detail: detail
        });
        slideshow.element.dispatchEvent(event);
    };

    function updateAriaLive(slideshow) {
        slideshow.ariaLive.innerHTML = 'Item ' + (slideshow.selectedSlide + 1) + ' of ' + slideshow.items.length;
    };

    function externalControlSlide(slideshow, button) { // control slideshow using external element
        button.addEventListener('click', function (event) {
            var index = button.getAttribute('data-index');
            if (!index || index == slideshow.selectedSlide + 1) return;
            event.preventDefault();
            showNewItem(slideshow, index - 1, false);
        });
    };

    Slideshow.defaults = {
        element: '',
        navigation: true,
        autoplay: false,
        autoplayInterval: 5000,
        swipe: false
    };

    window.Slideshow = Slideshow;

    //initialize the Slideshow objects
    var slideshows = document.getElementsByClassName('js-slideshow');
    if (slideshows.length > 0) {
        for (var i = 0; i < slideshows.length; i++) {
            (function (i) {
                var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
                    autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
                    autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
                    swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false;
                new Slideshow({
                    element: slideshows[i],
                    navigation: navigation,
                    autoplay: autoplay,
                    autoplayInterval: autoplayInterval,
                    swipe: swipe
                });
            })(i);
        }
    }
}());
// File#: _2_svg-slideshow
// Usage: codyhouse.co/license
(function() {
  var ImgSlideshow = function(opts) {
    this.options = Util.extend(ImgSlideshow.defaults , opts);
		this.element = this.options.element;
		this.items = this.element.getElementsByClassName('js-svg-slideshow__item');
		this.controls = this.element.getElementsByClassName('js-svg-slideshow__control'); 
		this.selectedSlide = 0;
		this.autoplayId = false;
		this.autoplayPaused = false;
		this.navigation = false;
		this.navCurrentLabel = false;
		this.ariaLive = false;
		this.animating = false;
		this.animatingClass = 'svg-slideshow--is-animating';
    // store svg animation paths
		this.masks = this.element.getElementsByClassName('js-svg-slideshow__mask');
    this.maskNext = getMaskPoints(this, 'next');
		this.maskPrev = getMaskPoints(this, 'prev');
		// random number for mask id
		this.maskId = getRandomInt(0, 10000);
		initSlideshow(this);
		initSlideshowEvents(this);
		revealSlideshow(this);
  };

  function getMaskPoints(slideshow, direction) { // store the path points - will be used to transition between slides
    var array = [];
		var index = direction == 'next' ? 0 : 1;
		var groupElements = slideshow.masks[index].getElementsByTagName('g');
		for(var j = 0; j < groupElements.length; j++) {
			array[j] = [];
			var paths =  groupElements[j].getElementsByTagName('path');
			for(var i = 0; i < paths.length; i++) {
				array[j].push(paths[i].getAttribute('d'));
			}
		}
    return array;
	};
	
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	};
  
  function initSlideshow(slideshow) { // basic slideshow settings
    // reset slide items content -> replace img element with svg
    for(var i = 0; i < slideshow.items.length; i++) {
      initSlideContent(slideshow, slideshow.items[i], i);
    }
		// if no slide has been selected -> select the first one
		if(slideshow.element.getElementsByClassName('svg-slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'svg-slideshow__item--selected');
		slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('svg-slideshow__item--selected')[0]);
		// create an element that will be used to announce the new visible slide to SR
		var srLiveArea = document.createElement('div');
		Util.setAttributes(srLiveArea, {'class': 'sr-only js-svg-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
		slideshow.element.appendChild(srLiveArea);
		slideshow.ariaLive = srLiveArea;
  };

  function initSlideContent(slideshow, slide, index) {
		// replace each slide content with a svg element including image + clip-path
		var imgElement = slide.getElementsByTagName('img')[0],
			imgPath = imgElement.getAttribute('src'),
      imgAlt =  imgElement.getAttribute('alt'),
			viewBox = slideshow.masks[0].getAttribute('viewBox').split(' '),
      imageCode = '<image height="'+viewBox[3]+'px" width="'+viewBox[2]+'px" clip-path="url(#img-slide-'+slideshow.maskId+'-'+index+')" xlink:href="'+imgPath+'" href="'+imgPath+'"></image>';
		
			var slideContent = '<svg aria-hidden="true" viewBox="0 0 '+viewBox[2]+' '+viewBox[3]+'"><defs><clipPath id="img-slide-'+slideshow.maskId+'-'+index+'">';

			for(var i = 0; i < slideshow.maskNext.length; i++) {
				slideContent = slideContent + '<path d="'+slideshow.maskNext[i][slideshow.maskNext[i].length - 1]+'"></path>';
			}

			slideContent = slideContent + '</clipPath></defs>'+imageCode+'</svg>';

    slide.innerHTML = imgElement.outerHTML + slideContent;
    if(imgAlt) slide.setAttribute('aria-label', imgAlt);
  };

  function initSlideshowEvents(slideshow) {
    // if slideshow navigation is on -> create navigation HTML and add event listeners
		if(slideshow.options.navigation) {
			var navigation = document.createElement('ol'),
				navChildren = '';
			
			navigation.setAttribute('class', 'svg-slideshow__navigation');
			for(var i = 0; i < slideshow.items.length; i++) {
				var className = (i == slideshow.selectedSlide) ? 'class="svg-slideshow__nav-item svg-slideshow__nav-item--selected js-svg-slideshow__nav-item"' :  'class="svg-slideshow__nav-item js-svg-slideshow__nav-item"',
					navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-svg-slideshow__nav-current-label">Current Item</span>' : '';
				navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
			}

			navigation.innerHTML = navChildren;
			slideshow.navCurrentLabel = navigation.getElementsByClassName('js-svg-slideshow__nav-current-label')[0]; 
			slideshow.element.appendChild(navigation);
			slideshow.navigation = slideshow.element.getElementsByClassName('js-svg-slideshow__nav-item');

			navigation.addEventListener('click', function(event){
				navigateSlide(slideshow, event, true);
			});
			navigation.addEventListener('keyup', function(event){
				navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
			});
		}
    // slideshow arrow controls
		if(slideshow.controls.length > 0) {
			slideshow.controls[0].addEventListener('click', function(event){
				event.preventDefault();
				showNewItem(slideshow, slideshow.selectedSlide - 1, 'prev', true);
			});
			slideshow.controls[1].addEventListener('click', function(event){
				event.preventDefault();
        showNewItem(slideshow, slideshow.selectedSlide + 1, 'next', true);
			});
    }
    // swipe events
    if(slideshow.options.swipe) {
			//init swipe
			new SwipeContent(slideshow.element);
			slideshow.element.addEventListener('swipeLeft', function(event){
				showNewItem(slideshow, slideshow.selectedSlide + 1, 'next');
			});
			slideshow.element.addEventListener('swipeRight', function(event){
        showNewItem(slideshow, slideshow.selectedSlide - 1, 'prev');
			});
		}
    // autoplay
		if(slideshow.options.autoplay) {
			startAutoplay(slideshow);
			// pause autoplay if user is interacting with the slideshow
			slideshow.element.addEventListener('mouseenter', function(event){
				pauseAutoplay(slideshow);
				slideshow.autoplayPaused = true;
			});
			slideshow.element.addEventListener('focusin', function(event){
				pauseAutoplay(slideshow);
				slideshow.autoplayPaused = true;
			});
			slideshow.element.addEventListener('mouseleave', function(event){
				slideshow.autoplayPaused = false;
				startAutoplay(slideshow);
			});
			slideshow.element.addEventListener('focusout', function(event){
				slideshow.autoplayPaused = false;
				startAutoplay(slideshow);
			});
		}
		// init slide theme colors
		resetSlideshowTheme(slideshow, slideshow.selectedSlide);
	};
	
	function revealSlideshow(slideshow) {
		Util.addClass(slideshow.element, 'svg-slideshow--loaded');
	};

  function showNewItem(slideshow, index, direction, bool) { // update visible slide
		if(slideshow.animating) return;
		slideshow.animating = true;
		Util.addClass(slideshow.element, slideshow.animatingClass);
		if(index < 0) index = slideshow.items.length - 1;
		else if(index >= slideshow.items.length) index = 0;
		// reset dot navigation appearance
		resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
		// animate slide
		newItemAnimate(slideshow, index, slideshow.selectedSlide, direction);
		// if not autoplay, announce new slide to SR
    if(bool) updateAriaLive(slideshow, index); 
		// reset controls/navigation color themes
		resetSlideshowTheme(slideshow, index);
  };

  function newItemAnimate(slideshow, newIndex, oldIndex, direction) {
    // start slide transition
    var path = slideshow.items[newIndex].getElementsByTagName('path'),
			mask = direction == 'next' ? slideshow.maskNext : slideshow.maskPrev;
		for(var i = 0; i < path.length; i++) {
			path[i].setAttribute('d', mask[i][0]);
		}
    
    Util.addClass(slideshow.items[newIndex], 'svg-slideshow__item--animating');
    morphPath(path, mask, slideshow.options.transitionDuration, function(){ // morph callback function
      slideshow.items[oldIndex].setAttribute('aria-hidden', 'true');
      slideshow.items[newIndex].removeAttribute('aria-hidden');
      Util.addClass(slideshow.items[newIndex], 'svg-slideshow__item--selected');
      Util.removeClass(slideshow.items[newIndex], 'svg-slideshow__item--animating');
      Util.removeClass(slideshow.items[oldIndex], 'svg-slideshow__item--selected');
      slideshow.selectedSlide = newIndex;
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass);
      // reset autoplay
      pauseAutoplay(slideshow);
      startAutoplay(slideshow);
    });
  };

	function morphPath(path, points, duration, cb) { // morph 
		if(reducedMotion || !animeJSsupported) { // if reducedMotion on or JS animation not supported -> do not animate
			for(var i = 0; i < path.length; i++) {
				path[i].setAttribute('d', points[i][points[i].length - 1]);
			}
			cb();
      return;
		}
		for(var i = 0; i < path.length; i++) {
			var delay = i*100,
				cbFunction = (i == path.length - 1) ? cb : false;
			morphSinglePath(path[i], points[i], delay, duration, cbFunction);
		}
	};
	
	function morphSinglePath(path, points, delay, duration, cb) {
		var dAnimation = (points.length == 3) 
			? [{ value: [points[0], points[1]]}, { value: [points[1], points[2]]}]
			: [{ value: [points[0], points[1]]}];
    anime({
			targets: path,
			d: dAnimation,
      easing: 'easeOutQuad',
			duration: duration,
			delay: delay,
      complete: function() {
        if(cb) cb();
      }
    });
	};

  function navigateSlide(slideshow, event, keyNav) { 
		// user has interacted with the slideshow dot navigation -> update visible slide
		var target = event.target.closest('.js-svg-slideshow__nav-item');
		if(keyNav && target && !Util.hasClass(target, 'svg-slideshow__nav-item--selected')) {
      var index = Util.getIndexInArray(slideshow.navigation, target),
        direction = slideshow.selectedSlide < index ? 'next' : 'prev';
      showNewItem(slideshow, index, direction, true);
		}
	};
  
  function resetSlideshowNav(slideshow, newIndex, oldIndex) {
    if(slideshow.navigation) { // update selected dot
			Util.removeClass(slideshow.navigation[oldIndex], 'svg-slideshow__nav-item--selected');
			Util.addClass(slideshow.navigation[newIndex], 'svg-slideshow__nav-item--selected');
			slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
			slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
		}
	};
	
	function resetSlideshowTheme(slideshow, newIndex) { 
		// apply to controls/dot navigation, the same color-theme of the selected slide
		var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
		if(dataTheme) {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
		} else {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
		}
	};

  function updateAriaLive(slideshow, index) { // announce new selected slide to SR
    var announce = 'Item '+(index + 1)+' of '+slideshow.items.length,
      label = slideshow.items[index].getAttribute('aria-label');
    if(label) announce = announce+' '+label;
		slideshow.ariaLive.innerHTML = announce;
  };

  function startAutoplay(slideshow) {
		if(slideshow.options.autoplay && !slideshow.autoplayId && !slideshow.autoplayPaused) {
			slideshow.autoplayId = setInterval(function(){
				showNewItem(slideshow, slideshow.selectedSlide + 1, 'next');
			}, slideshow.options.autoplayInterval);
		}
  };

  function pauseAutoplay(slideshow) {
    if(slideshow.options.autoplay) {
			clearInterval(slideshow.autoplayId);
			slideshow.autoplayId = false;
		}
  };
  
  //initialize the ImgSlideshow objects
  var slideshows = document.getElementsByClassName('js-svg-slideshow'),
		reducedMotion = Util.osHasReducedMotion(),
		animeJSsupported = window.Map; // test if the library used for the animation works
	if( slideshows.length > 0 ) {
		for( var i = 0; i < slideshows.length; i++) {
			(function(i){
				var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
					autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
					autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
					swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false,
					transitionDuration = (slideshows[i].getAttribute('data-transition-duration')) ? slideshows[i].getAttribute('data-transition-duration') : 400;
				new ImgSlideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe, transitionDuration: transitionDuration});
			})(i);
		}
	}
}());
// File#: _3_thumbnail-slideshow
// Usage: codyhouse.co/license
(function () {
    var ThumbSlideshow = function (element) {
        this.element = element;
        this.slideshow = this.element.getElementsByClassName('slideshow')[0];
        this.slideshowItems = this.slideshow.getElementsByClassName('js-slideshow__item');
        this.carousel = this.element.getElementsByClassName('thumbslide__nav-wrapper')[0];
        this.carouselList = this.carousel.getElementsByClassName('thumbslide__nav-list')[0];
        this.carouselListWrapper = this.carousel.getElementsByClassName('thumbslide__nav')[0];
        this.carouselControls = this.element.getElementsByClassName('js-thumbslide__tb-control');
        // custom obj
        this.slideshowObj = false;
        // thumb properties
        this.thumbItems = false;
        this.thumbOriginalWidth = false;
        this.thumbOriginalHeight = false;
        this.thumbVisibItemsNb = false;
        this.itemsWidth = false;
        this.itemsHeight = false;
        this.itemsMargin = false;
        this.thumbTranslateContainer = false;
        this.thumbTranslateVal = 0;
        // vertical variation
        this.thumbVertical = Util.hasClass(this.element, 'thumbslide--vertical');
        // recursive update 
        this.recursiveDirection = false;
        // drag events 
        this.thumbDragging = false;
        this.dragStart = false;
        // resize
        this.resize = false;
        // image load -> store info about thumb image being loaded
        this.loaded = false;
        initThumbs(this);
        initSlideshow(this);
        checkImageLoad(this);
    };

    function initThumbs(thumbSlider) { // create thumb items
        var carouselItems = '';
        for (var i = 0; i < thumbSlider.slideshowItems.length; i++) {
            var url = thumbSlider.slideshowItems[i].getAttribute('data-thumb'),
                alt = thumbSlider.slideshowItems[i].getAttribute('data-alt');
            if (!alt) alt = 'Image Preview';
            carouselItems = carouselItems + '<li class="thumbslide__nav-item"><img src="' + url + '" alt="' + alt + '">' + '</li>';
        }
        thumbSlider.carouselList.innerHTML = carouselItems;
        if (!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
        else loadThumbsVerticalLayout(thumbSlider);
    };

    function initThumbsLayout(thumbSlider) { // set thumbs visible numbers + width
        // evaluate size of single elements + number of visible elements
        thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item');

        var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
            containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
            itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
            itemMargin = parseFloat(itemStyle.getPropertyValue('margin-right')),
            containerPadding = parseFloat(containerStyle.getPropertyValue('padding-left')),
            containerWidth = parseFloat(containerStyle.getPropertyValue('width'));

        if (!thumbSlider.thumbOriginalWidth) { // on resize -> use initial width of items to recalculate 
            thumbSlider.thumbOriginalWidth = itemWidth;
        } else {
            itemWidth = thumbSlider.thumbOriginalWidth;
        }
        // get proper width of elements
        thumbSlider.thumbVisibItemsNb = parseInt((containerWidth - 2 * containerPadding + itemMargin) / (itemWidth + itemMargin));
        thumbSlider.itemsWidth = ((containerWidth - 2 * containerPadding + itemMargin) / thumbSlider.thumbVisibItemsNb) - itemMargin;
        thumbSlider.thumbTranslateContainer = (((thumbSlider.itemsWidth + itemMargin) * thumbSlider.thumbVisibItemsNb));
        thumbSlider.itemsMargin = itemMargin;
        // flexbox fallback
        if (!flexSupported) thumbSlider.carouselList.style.width = (thumbSlider.itemsWidth + itemMargin) * thumbSlider.slideshowItems.length + 'px';
        setThumbsWidth(thumbSlider);
    };

    function checkImageLoad(thumbSlider) {
        if (!thumbSlider.thumbVertical) { // no need to wait for image load, we already have their width
            updateVisibleThumb(thumbSlider, 0);
            updateThumbControls(thumbSlider);
            initTbSlideshowEvents(thumbSlider);
        } else { // wait for image to be loaded -> need to know the right height
            var image = new Image();
            image.onload = function () {
                thumbSlider.loaded = true;
            }
            image.onerror = function () {
                thumbSlider.loaded = true;
            }
            image.src = thumbSlider.slideshowItems[0].getAttribute('data-thumb');
        }
    };

    function loadThumbsVerticalLayout(thumbSlider) {
        // this is the vertical layout -> we need to make sure the thumb are loaded before checking the value of their height
        if (thumbSlider.loaded) {
            initThumbsVerticalLayout(thumbSlider);
            updateVisibleThumb(thumbSlider, 0);
            updateThumbControls(thumbSlider);
            initTbSlideshowEvents(thumbSlider);
        } else { // wait for thumbs to be loaded
            setTimeout(function () {
                loadThumbsVerticalLayout(thumbSlider);
            }, 100);
        }
    }

    function initThumbsVerticalLayout(thumbSlider) {
        // evaluate size of single elements + number of visible elements
        thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item');

        var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
            containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
            itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
            itemHeight = parseFloat(itemStyle.getPropertyValue('height')),
            itemRatio = itemWidth / itemHeight,
            itemMargin = parseFloat(itemStyle.getPropertyValue('margin-bottom')),
            containerPadding = parseFloat(containerStyle.getPropertyValue('padding-top')),
            containerWidth = parseFloat(containerStyle.getPropertyValue('width')),
            containerHeight = parseFloat(containerStyle.getPropertyValue('height'));

        if (!flexSupported) containerHeight = parseFloat(window.getComputedStyle(thumbSlider.element).getPropertyValue('height'));

        if (!thumbSlider.thumbOriginalHeight) { // on resize -> use initial width of items to recalculate 
            thumbSlider.thumbOriginalHeight = itemHeight;
            thumbSlider.thumbOriginalWidth = itemWidth;
        } else {
            resetOriginalSize(thumbSlider);
            itemHeight = thumbSlider.thumbOriginalHeight;
        }
        // get proper height of elements
        thumbSlider.thumbVisibItemsNb = parseInt((containerHeight - 2 * containerPadding + itemMargin) / (itemHeight + itemMargin));
        thumbSlider.itemsHeight = ((containerHeight - 2 * containerPadding + itemMargin) / thumbSlider.thumbVisibItemsNb) - itemMargin;
        thumbSlider.itemsWidth = thumbSlider.itemsHeight * itemRatio,
            thumbSlider.thumbTranslateContainer = (((thumbSlider.itemsHeight + itemMargin) * thumbSlider.thumbVisibItemsNb));
        thumbSlider.itemsMargin = itemMargin;
        // flexbox fallback
        if (!flexSupported) {
            thumbSlider.carousel.style.height = (thumbSlider.itemsHeight + itemMargin) * thumbSlider.slideshowItems.length + 'px';
            thumbSlider.carouselListWrapper.style.height = containerHeight + 'px';
        }
        setThumbsWidth(thumbSlider);
    };

    function setThumbsWidth(thumbSlider) { // set thumbs width
        for (var i = 0; i < thumbSlider.thumbItems.length; i++) {
            thumbSlider.thumbItems[i].style.width = thumbSlider.itemsWidth + "px";
            if (thumbSlider.thumbVertical) thumbSlider.thumbItems[i].style.height = thumbSlider.itemsHeight + "px";
        }

        if (thumbSlider.thumbVertical) {
            var padding = parseFloat(window.getComputedStyle(thumbSlider.carouselListWrapper).getPropertyValue('padding-left'));
            thumbSlider.carousel.style.width = (thumbSlider.itemsWidth + 2 * padding) + "px";
            if (!flexSupported) thumbSlider.slideshow.style.width = (parseFloat(window.getComputedStyle(thumbSlider.element).getPropertyValue('width')) - (thumbSlider.itemsWidth + 2 * padding) - 10) + 'px';
        }
    };

    function initSlideshow(thumbSlider) { // for the main slideshow, we are using the Slideshow component -> we only need to initialize the object
        var autoplay = (thumbSlider.slideshow.getAttribute('data-autoplay') && thumbSlider.slideshow.getAttribute('data-autoplay') == 'on') ? true : false,
            autoplayInterval = (thumbSlider.slideshow.getAttribute('data-autoplay-interval')) ? thumbSlider.slideshow.getAttribute('data-autoplay-interval') : 5000,
            swipe = (thumbSlider.slideshow.getAttribute('data-swipe') && thumbSlider.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
        thumbSlider.slideshowObj = new Slideshow({
            element: thumbSlider.slideshow,
            navigation: false,
            autoplay: autoplay,
            autoplayInterval: autoplayInterval,
            swipe: swipe
        });
    };

    function initTbSlideshowEvents(thumbSlider) {
        // listen for new slide selection -> 'newItemSelected' custom event is emitted each time a new slide is selected
        thumbSlider.slideshowObj.element.addEventListener('newItemSelected', function (event) {
            updateVisibleThumb(thumbSlider, event.detail);
        });

        // click on a thumbnail -> update slide in slideshow
        thumbSlider.carouselList.addEventListener('click', function (event) {
            if (thumbSlider.thumbDragging) return;
            var selectedOption = event.target.closest('.thumbslide__nav-item');
            if (!selectedOption || Util.hasClass(selectedOption, 'thumbslide__nav-item--active')) return;
            thumbSlider.slideshowObj.showItem(Util.getIndexInArray(thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item'), selectedOption));
        });

        // reset thumbnails on resize
        window.addEventListener('resize', function (event) {
            if (thumbSlider.resize) return;
            thumbSlider.resize = true;
            window.requestAnimationFrame(resetThumbsResize.bind(thumbSlider));
        });

        // enable drag on thumbnails
        new SwipeContent(thumbSlider.carouselList);
        thumbSlider.carouselList.addEventListener('dragStart', function (event) {
            var coordinate = getDragCoordinate(thumbSlider, event);
            thumbSlider.dragStart = coordinate;
            thumbDragEnd(thumbSlider);
        });
        thumbSlider.carouselList.addEventListener('dragging', function (event) {
            if (!thumbSlider.dragStart) return;
            var coordinate = getDragCoordinate(thumbSlider, event);
            if (thumbSlider.slideshowObj.animating || Math.abs(coordinate - thumbSlider.dragStart) < 20) return;
            Util.addClass(thumbSlider.element, 'thumbslide__nav-list--dragging');
            thumbSlider.thumbDragging = true;
            Util.addClass(thumbSlider.carouselList, 'thumbslide__nav-list--no-transition');
            var translate = thumbSlider.thumbVertical ? 'translateY' : 'translateX';
            setTranslate(thumbSlider, translate + '(' + (thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart) + 'px)');
        });
    };

    function thumbDragEnd(thumbSlider) {
        thumbSlider.carouselList.addEventListener('dragEnd', function cb(event) {
            var coordinate = getDragCoordinate(thumbSlider, event);
            thumbSlider.thumbTranslateVal = resetTranslateToRound(thumbSlider, thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart);
            thumbShowNewItems(thumbSlider, false);
            thumbSlider.dragStart = false;
            Util.removeClass(thumbSlider.carouselList, 'thumbslide__nav-list--no-transition');
            thumbSlider.carouselList.removeEventListener('dragEnd', cb);
            setTimeout(function () {
                thumbSlider.thumbDragging = false;
            }, 50);
            Util.removeClass(thumbSlider.element, 'thumbslide__nav-list--dragging');
        });
    };

    function getDragCoordinate(thumbSlider, event) { // return the drag value based on direction of thumbs navugation
        return thumbSlider.thumbVertical ? event.detail.y : event.detail.x;
    }

    function resetTranslateToRound(thumbSlider, value) { // at the ed of dragging -> set translate of coontainer to right value
        var dimension = getItemDimension(thumbSlider);
        return Math.round(value / (dimension + thumbSlider.itemsMargin)) * (dimension + thumbSlider.itemsMargin);
    };

    function resetThumbsResize() { // reset thumbs width on resize
        var thumbSlider = this;
        if (!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
        else initThumbsVerticalLayout(thumbSlider);
        setThumbsWidth(thumbSlider);
        var dimension = getItemDimension(thumbSlider);
        // reset the translate value of the thumbs container as well
        if ((-1) * thumbSlider.thumbTranslateVal % (dimension + thumbSlider.itemsMargin) > 0) {
            thumbSlider.thumbTranslateVal = -1 * parseInt(((-1) * thumbSlider.thumbTranslateVal) / (dimension + thumbSlider.itemsMargin)) * (dimension + thumbSlider.itemsMargin);
            thumbShowNewItems(thumbSlider, false);
        }
        thumbSlider.resize = false;
    };

    function thumbShowNewItems(thumbSlider, direction) { // when a new slide is selected -> update position of thumbs navigation
        var dimension = getItemDimension(thumbSlider);
        if (direction == 'next') thumbSlider.thumbTranslateVal = thumbSlider.thumbTranslateVal - thumbSlider.thumbTranslateContainer;
        else if (direction == 'prev') thumbSlider.thumbTranslateVal = thumbSlider.thumbTranslateVal + thumbSlider.thumbTranslateContainer;
        // make sure translate value is correct
        if (-1 * thumbSlider.thumbTranslateVal >= (thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb) * (dimension + thumbSlider.itemsMargin)) thumbSlider.thumbTranslateVal = -1 * ((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb) * (dimension + thumbSlider.itemsMargin));
        if (thumbSlider.thumbTranslateVal > 0) thumbSlider.thumbTranslateVal = 0;

        var translate = thumbSlider.thumbVertical ? 'translateY' : 'translateX';
        setTranslate(thumbSlider, translate + '(' + thumbSlider.thumbTranslateVal + 'px)');
        updateThumbControls(thumbSlider);
    };

    function updateVisibleThumb(thumbSlider, index) { // update selected thumb
        // update selected thumbnails
        var selectedThumb = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item--active');
        if (selectedThumb.length > 0) Util.removeClass(selectedThumb[0], 'thumbslide__nav-item--active');
        Util.addClass(thumbSlider.thumbItems[index], 'thumbslide__nav-item--active');
        // update carousel translate value if new thumb is not visible
        recursiveUpdateThumb(thumbSlider, index);
    };

    function recursiveUpdateThumb(thumbSlider, index) { // recursive function used to update the position of thumbs navigation (eg when going from last slide to first one)
        var dimension = getItemDimension(thumbSlider);
        if (((index + 1 - thumbSlider.thumbVisibItemsNb) * (dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal >= 0) || (index * (dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal <= 0 && thumbSlider.thumbTranslateVal < 0)) {
            var increment = ((index + 1 - thumbSlider.thumbVisibItemsNb) * (dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal >= 0) ? 1 : -1;
            if (!thumbSlider.recursiveDirection || thumbSlider.recursiveDirection == increment) {
                thumbSlider.thumbTranslateVal = -1 * increment * (dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal;
                thumbSlider.recursiveDirection = increment;
                recursiveUpdateThumb(thumbSlider, index);
            } else {
                thumbSlider.recursiveDirection = false;
                thumbShowNewItems(thumbSlider, false);
            }
        } else {
            thumbSlider.recursiveDirection = false;
            thumbShowNewItems(thumbSlider, false);
        }
    }

    function updateThumbControls(thumbSlider) { // reset thumb controls style
        var dimension = getItemDimension(thumbSlider);
        Util.toggleClass(thumbSlider.carouselListWrapper, 'thumbslide__nav--scroll-start', (thumbSlider.thumbTranslateVal != 0));
        Util.toggleClass(thumbSlider.carouselListWrapper, 'thumbslide__nav--scroll-end', (thumbSlider.thumbTranslateVal != -1 * ((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb) * (dimension + thumbSlider.itemsMargin))) && (thumbSlider.thumbItems.length > thumbSlider.thumbVisibItemsNb));
        if (thumbSlider.carouselControls.length == 0) return;
        Util.toggleClass(thumbSlider.carouselControls[0], 'thumbslide__tb-control--disabled', (thumbSlider.thumbTranslateVal == 0));
        Util.toggleClass(thumbSlider.carouselControls[1], 'thumbslide__tb-control--disabled', (thumbSlider.thumbTranslateVal == -1 * ((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb) * (dimension + thumbSlider.itemsMargin))));
    };

    function getItemDimension(thumbSlider) {
        return thumbSlider.thumbVertical ? thumbSlider.itemsHeight : thumbSlider.itemsWidth;
    }

    function setTranslate(thumbSlider, translate) {
        thumbSlider.carouselList.style.transform = translate;
        thumbSlider.carouselList.style.msTransform = translate;
    };

    function resetOriginalSize(thumbSlider) {
        if (!Util.cssSupports('color', 'var(--var-name)')) return;
        var thumbWidth = parseInt(getComputedStyle(thumbSlider.element).getPropertyValue('--thumbslide-thumbnail-auto-size'));
        if (thumbWidth == thumbSlider.thumbOriginalWidth) return;
        thumbSlider.thumbOriginalHeight = parseFloat((thumbSlider.thumbOriginalHeight) * (thumbWidth / thumbSlider.thumbOriginalWidth));
        thumbSlider.thumbOriginalWidth = thumbWidth;
    };

    //initialize the ThumbSlideshow objects
    var thumbSlideshows = document.getElementsByClassName('js-thumbslide'),
        flexSupported = Util.cssSupports('align-items', 'stretch');
    if (thumbSlideshows.length > 0) {
        for (var i = 0; i < thumbSlideshows.length; i++) {
            (function (i) {
                new ThumbSlideshow(thumbSlideshows[i]);
            })(i);
        }
    }
}());