odoo.define("web_widget_text_collapse_bootstrap.collapse",
  function(require) {
    "use strict";

    // require of classes of odoo
    var core = require('web.core');
    var form_common = require('web.form_common');
    var formats = require("web.formats");

    // core._lt tool for allows term translation into the module
    var _lt = core._lt;

    //tool for displaying the component in the list view
    var ListView = require('web.ListView');
    var list_widget_registry = core.list_widget_registry;

    //created a new field that inherits from the odoo standard fields
    var FieldTextBootstrap = form_common.AbstractField.extend(
      form_common.ReinitializeFieldMixin, {
        // QWeb template to use when rendering the object
        template: 'FieldTextCollapse',
        display_name: _lt('Collapse'),
        widget_class: 'oe_form_field_collapse',
        /*
         * change input: save changes when changed
         * click a : allows to manage the change of state of the link
        */
        events: {
          'change input': 'store_dom_value',
          'click a' : 'a_click'
        },

        //function for change state of the link
        a_click: function() {
            if(this.$el.find("#a_collapse") &&  this.$el.find("#a_collapse")[0].innerText == _lt("show")){
                this.$el.find("#a_collapse")[0].innerText = _lt("hide");
             }else{
                this.$el.find("#a_collapse")[0].innerText = _lt("show");
              }
        },

        //initialization method of widgets
        init: function(field_manager, node) {
          this._super(field_manager, node);
          this.$txt = false;

          this.old_value = null;
        },

        parse_value: function(val, def) {
          return formats.parse_value(val, this, def);
        },

        /*
         * called at each redraw of widget
         * switching between read-only mode and edit mode
         * is not called when moving to the next element
        */
        initialize_content: function() {
          this.$txt = this.$el.find('textarea[name="' + this.name + '"]');
          if (!this.get('effective_readonly')) {
            this.$txt.markdown({
              autofocus: false,
              savable: false,
              iconlibrary: "fa"
            });
          }
          this.old_value = null; // will trigger a redraw
        },

         // save changes
        store_dom_value: function() {
          if (!this.get('effective_readonly') &&
            this.is_syntax_valid()) {
            // We use internal_set_value because we were called by
            // ``.commit_value()`` which is called by a ``.set_value()``
            // itself called because of a ``onchange`` event
            this.internal_set_value(
              this.parse_value(
                this._get_raw_value()
              )
            );
          }
        },

        commit_value: function() {
          this.store_dom_value();
          return this._super();
        },

        _get_raw_value: function() {
          if (this.$txt === false) {
            return '';
          }
          return this.$txt.val();
        },

        /*
         * called at each redraw of widget
         * switching between read-only mode and edit mode
         * is called when moving to the next element
        */
        render_value: function() {
          var show_value = this.format_value(this.get('value'), '');
          if (!this.get("effective_readonly")) {
            this.$txt.val(show_value);
            this.$el.trigger('resize');
          } else {
            // avoids loading markitup...
            marked.setOptions({
              highlight: function(code) {
                return hljs.highlightAuto(code).value;
              }
            });
            this.$el.find('span[class="oe_form_text_content"]').html(marked(show_value));
          }
        },

        format_value: function(val, def) {
          return formats.format_value(val, this, def);
        }
      }
    );

    // save the widget
    core.form_widget_registry.add('text_collapse_bootstrap',
      FieldTextBootstrap);

    /**
     * text_collapse support on list view
     **/
    ListView.Column.include({

      init: function() {
        this._super.apply(this, arguments);
        hljs.initHighlightingOnLoad();
        marked.setOptions({
          sanitize: true,
          highlight: function(code) {
            return hljs.highlightAuto(code).value;
          }
        });
      },

      _format: function(row_data, options) {
        if (this.type === "text") {
          options = options || {};
          var markdown_text = marked(
            formats.format_value(
              row_data[this.id].value, this, options.value_if_empty
            )
          );
          return markdown_text;
        }
        return this._super(row_data, options)
      }
    });

    //save the widget
    list_widget_registry.add('field.collapse', ListView.Column);

  });
