/* 
 * Talik Kasozi December 6, 2016
 * 
 * Implementation of a Typeahead plugin
 */

//TODO: 
//
//imediately invoked expression Typeahead
(function () {


    var currentItem;
    var $listItems,
            $selected,
            $current;
    var pattern, initSearchHeight;

    //Constructor
    this.TypeAhead = function () {

        //Global Element Refference
        this.typeahead = null;
        this.word = "";

        //Option Default
        var defaults = {
            className: "search-result-div",
            data: [],
            content: "",
            maxwidth: 100, //%
            minwidth: 100, //%
            color: "red",
            searchIcon: '#fa-search-color',
            inputTagName: "inputTag"
        };


        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

    };

    //Public Methods
    this.TypeAhead.prototype.init = function () {
        typeaheadProc.call(this);
        //console.log('this.options.data: ',this.options.data[5].keyword);
    };

    //Private Methods
    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    //clear div
    function empty(node) {
        while (node.hasChildNodes()) {
            node.removeChild(node.firstChild);
        }
    }

    //Utility method to start the typeahead
    function typeaheadProc() {
        var _ = this;
        //search dropdown called     
        var input = document.getElementById(_.options.inputTagName);

        buildOut.call(this);

        input.onkeyup = function (e) {
            $(_.options.searchIcon).css('color', _.options.color);
            var node = document.getElementById(_.options.className);

            empty(node);


            matchedWords(this.value, _);

            return null;
        };

    }

    //Utility method to create html result
    //matched-word,lighlight-color
    function buildOut() {
        var contentHolder, docFrag;

        //create documentFragment to work with
        docFrag = document.createDocumentFragment();

        //Wraps the result before append to body
        contentHolder = document.getElementById(this.options.inputTagName).parentNode;

        //create element
        this.typeahead = document.createElement("div");

        this.typeahead.id = this.options.className;
        this.typeahead.className = this.options.className;
        this.typeahead.style.minWidth = this.options.minWidth + "%";
        this.typeahead.style.maxWidth = this.options.maxWidth + "%";
        this.typeahead.style.backgroundColor = "white";

        //append typeahead to docFrag
        docFrag.appendChild(this.typeahead);

        //append docFrag to element that requires typeAhead results.
        contentHolder.appendChild(docFrag);
    }

    //Utility method to match typed characters with available words
    //takes input element, array of target 
    //returns array of matched words
    //value is of the input 
    function matchedWords(value, _) {
        var isMatched = false;
        var re = /(\w+)\s(\w+)/;
        var word;
        var wordTarget = (new String(value)).toLowerCase();

        for (var match in _.options.data) {
            for (var x = 0; x < _.options.data[match].keyword.length; x++) {
                word = new String(_.options.data[match].keyword[x]).toLowerCase();

                pattern = word.replace(re, '/$1\\s$2/');

                if (word.match(wordTarget, pattern) && wordTarget.length > 0) {//inmplement include
                    _.word = word;
                    contentDiv.call(_);
                    isMatched = true;
                }
            }
        }

        if (!isMatched && value) { //ie input is not null
            var noResult = document.createElement("div");
            var hr = document.createElement("hr");

            var node = document.createTextNode("No Result");

            noResult.style.textAlign = "center";
            noResult.style.fontSize = "1.1rem";
            noResult.style.fontWeight = "500";
            noResult.className = "no-result-hr";

            noResult.appendChild(node);
            noResult.appendChild(hr);

            _.typeahead.appendChild(noResult);
        }
    }

    //create a list items. 
    function contentDiv() {
        //remove spaces
        var _ = this, newString = (new String(this.word)), re = /(\w+)\s(\w+)/, tag, attr;
        var contentHolder, node, constantClass = "highlight-searchTab tagged";

        newString = newString.replace(re, '$1\$2');
        tag = newString + "WordID";

        contentHolder = document.createElement("div");
        node = document.createTextNode(this.word);

        //attr
        contentHolder.id = tag;

        for (attr in this.options.data) {
            for (var x = 0; x < _.options.data[attr].keyword.length; x++) {

                var keyword = (new String(this.options.data[attr].keyword[x])).toLowerCase();

                if (this.word === keyword)
                    //console.log("this.options.data[attr].page: ",this.options.data[attr].page);
                    contentHolder.sourceLocation = this.options.data[attr].page; //TBD
            }
        }
        contentHolder.className = constantClass;

        //style
        contentHolder.style.color = this.color;
        contentHolder.style.maxWidth = this.options.maxWidth + "%";
        contentHolder.style.minWidth = this.options.minWidth + "%";
        //html
        contentHolder.appendChild(node); //innerHTML = this.word;

        this.typeahead.appendChild(contentHolder);

        document.getElementById(contentHolder.id).onclick = function () {
            document.getElementById(_.options.inputTagName).value = this.innerHTML;
            window.location = contentHolder.sourceLocation;
        };

        initSearchHeight = document.getElementById('search-result-div').offsetHeight;
        (this.typeahead).parentNode.parentNode.style.paddingBottom = initSearchHeight + 'px';
        //(this.typeahead).firstChild.className = "highlight " + constantClass;

        //after result is displayed 
        linkResultToHTML(this, constantClass);
    }

    //Utility method to link the search-result to html
    //pages
    function linkResultToHTML(_this, constantClass) {
        var $parent = _this.typeahead;
        $listItems = $parent;

        input = document.getElementById(_this.options.inputTagName);

        if (!currentItem) {
            currentItem = $parent.firstChild;
            currentItem.className = "highlight " + constantClass;
        }

        $current = currentItem;

        if (!$selected && $current)
            $selected = $current;

        $parent.onmouseover = function (e) {
            if ($selected) {
                $selected.className = constantClass;
            }
            $current.className = constantClass;
        };

        input.onkeyup = function (e) {

            switch (e.which) {
                case 13: //enter key
                    var TEMP = $parent.getElementsByClassName('highlight')[0];

                    if (TEMP) {
                        input.value = TEMP.innerHTML;
                        window.location = TEMP.sourceLocation;
                    }

                    break;

                case 37: // left
                case 39: // right
                    break;

                case 38: // up  
                    $parent.firstChild.className = constantClass; //remove highlight class

                    input.className = "input-hidden-cursor";

                    if (!$current.previousSibling || $current === $listItems.firstChild) {
                        $selected = $listItems.lastChild;
                    } else {
                        $selected = $current.previousSibling;
                    }

                    $current.className = constantClass;//remove the highlight class
                    $selected.className = "highlight " + constantClass;

                    currentItem = $selected;

                    break;
                case 40: // down

                    $parent.firstChild.className = constantClass; //remove highlight class

                    input.className = "input-hidden-cursor";

                    if (!$current.nextSibling || $current === $listItems.lastChild) {
                        $selected = $listItems.firstChild;
                    } else {
                        $selected = $current.nextSibling;
                    }

                    $current.className = constantClass;//remove the highlight class
                    $selected.className = "highlight " + constantClass;

                    currentItem = $selected;

                    break;

                default:

                    empty(document.getElementById(_this.options.className));
                    matchedWords(input.value, _this);
                    $selected = null;
            }

            if (!$('#tags').val()) {
                $(_this.options.searchIcon).css('color', '#d3d3d3');
            } else {
                $(_this.options.searchIcon).css('color', _this.options.color);
            }
            initSearchHeight = document.getElementById('search-result-div').offsetHeight;
            ($parent).parentNode.parentNode.style.paddingBottom = initSearchHeight + 'px';

            $current = currentItem;
            //e.preventDefault(); // prevent the default action (scroll / move caret)
        };

        input.onclick = function (e) {
            this.className = "";
        };
    }
}());//end of typeahead