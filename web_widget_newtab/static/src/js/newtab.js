odoo.define("web_widget_newtab.newtab",
    function(require) {
    "use strict";
    // require of classes of odoo
    var core = require('web.core');
    var form_widget = require('web.form_widgets');
    var FormView = core.view_registry.get('form');


    form_widget.WidgetButton.include({
           cntrlIsPressed : false,
        start:function(){
            this._super();
                $(document).keydown(function(event){
                    if(event.which=="17")
                        self.cntrlIsPressed = true;
                });

                $(document).keyup(function(){
                    self.cntrlIsPressed = false;
                });
        },
         on_click: function() {
             this._super();
             if (self.cntrlIsPressed){
                var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                if(!is_chrome){
                    var url = window.location.href;
                    var win = window.open(url, '_blank');
                } else {
                    var a = document.createElement('a');
                    a.href = window.location.href;
                    var evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
                    a.dispatchEvent(evt);
                }
             }
         }
      });

      FormView.include({
            cntrlIsPressed : false,
            events: {
              'click a.o_form_uri' : 'a_clicked'
            },
            init: function () {
                this._super.apply(this, arguments);
                $(document).keydown(function(event){
                    if(event.which=="17")
                        self.cntrlIsPressed = true;
                });

                $(document).keyup(function(){
                    self.cntrlIsPressed = false;
                });
            },
            a_clicked: function() {
                if (self.cntrlIsPressed){
                var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                if(!is_chrome){
                    var url = window.location.href;
                    var win = window.open(url, '_blank');
                } else {
                    var a = document.createElement('a');
                    a.href = window.location.href;
                    var evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
                    a.dispatchEvent(evt);
                }
             }
            }

        });

  });
