odoo.define("web_widget_text_collapse_html.collapse",
  function(require) {
    "use strict";

    // require of classes of odoo
    var core = require('web.core');

    // core._lt tool for allows term translation into the module
    var _lt = core._lt;

    //created a new field that inherits from the odoo standard fields
    var TextCollapse = core.form_widget_registry.get("html");

    var textCollapseHTML = TextCollapse.extend({
        //function for change state of the link
        a_click: function() {
            if(this.innerText == core._t("show")){
                this.innerText = core._t("hide");
             }else{
                this.innerText = core._t("show");
              }
        },

        ckeditor_config: function() {
            var self = this;
            var config = self._super.apply(self, arguments);
            config["height"] = 200;
            config.removePlugins = this._getRemovePlugins();
            config.removeButtons = this._getRemoveButtons();
            config.extraPlugins= 'filebrowser';
            config.entities_additional = '';
            return config;
        },

        _getRemovePlugins: function () {
            //return 'iframe,flash,forms,smiley,pagebreak,stylescombo';
            return '';
        },

        _getRemoveButtons: function () {
            return '';
        },

        start: function() {
            var self = this;
            self._super();
            if(self.get("effective_readonly")){
                var a = $('<a>')
                    .attr('id', 'a_collapse')
                    .attr('role', 'button')
                    .attr('data-toggle', 'collapse')
                    .attr('data-parent', '#'+ self.id_for_label)
                    .attr('href', '#'+ self.id_for_label)
                    .attr('aria-expanded', 'true')
                    .attr('aria-controls',  self.id_for_label)
                    .text(_lt("show"));
                a.click(this.a_click);
                this.$el.before( a );
                this.$el.wrap( '<div id="' + self.id_for_label + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne"></div>' );
            }
        },

        initialize_content: function() {
            var self = this;
            self._super.apply(self, arguments);
        }
    });

    // save the widget
    core.form_widget_registry.add('text_collapse_html',
      TextCollapse);

  });
