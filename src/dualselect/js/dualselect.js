(function($) {

	$.fn.dualselect = function(options) {
		if (this.length == 0) {
			return this;
		}

		// variables //////////////////////////////////////////////////////////////////////////////
		var _plugin_name = 'dualselect';
		var _element = this;
		var _wrapper;
		var _dualselect_avl_class;
		var _dualselect_avl_id;
		var _dualselect_sel_class;
		var _dualselect_sel_id;
		// default funcitons //////////////////////////////////////////////////////////////////////
		var _before_select_option = function(_option) { return true; };
		var _before_remove_option = function(_option) { return true; };

		// default settings ///////////////////////////////////////////////////////////////////////
		var defaults = {
			dualselectClass: 'is-dualselect'
			,wrapperElement: 'div'
			,wrapperClass: 'dualselect-wrapper'
			,beforeSelectOption: _before_select_option
			,beforeRemoveOption: _before_remove_option
			,moveOnSelect: true
			,showMoveButtons: true
			,selectText: '&gt;'
			,selectAllText: '&gt;&gt;'
			,removeText: '&lt;'
			,removeAllText: '&lt;&lt;'
			,showFilters: true
		};
		var opt = $.extend({}, defaults, options);

		if (this.length > 1) {
			var arr = [];
			this.each(function(idx, elm){
				if ( !($(elm).is('select')) ) {
					throw (elm.localName) + ' is not a select. ' + _plugin_name + ' works with select html element.';
				}
				var db = $(this).dualselect(options);
				arr.push(db);
			});
			return $(arr);
		} else {
			if (!this.is('select')) {
				throw (this.get(0).localName) + ' is not a select. ' + _plugin_name + ' works with select html element.';
			}
		}

		// public methods /////////////////////////////////////////////////////////////////////////
		// ctor
		this.dualselect = function() {
			init();
			return this;
		};

		// resync
		this.resync = function() {
			jQuery('#' + _dualselect_avl_id).children().remove();
			jQuery('#' + _dualselect_sel_id).children().remove();
			jQuery('#' + _dualselect_avl_id + '_filter_text,#' + _dualselect_sel_id + '_filter_text').val('');
			createAvailableOptions();
			createSelectedOptions();
			return _element;
		}

		// dtor
		this.destroy = function() {
			_element.insertAfter(_wrapper);
			var wrapper = _wrapper.remove();
			_wrapper = undefined;
			_element.removeClass(opt.dualselectClass + '-element').show();
			return _element.get(0);
		};

		// internal methods ///////////////////////////////////////////////////////////////////////
		var init = function() {
			if (!_element.hasClass(opt.dualselectClass + '-element')) {
				// if it is not a dualselect object
				_element.hide();
				_element.addClass(opt.dualselectClass + '-element');
				_dualselect_avl_class = '_dualselect_avl_' + _element.attr('name');
				_dualselect_avl_id = '_dualselect_avl_' + _element.attr('id');
				_dualselect_sel_class = '_dualselect_sel_' + _element.attr('name');
				_dualselect_sel_id = '_dualselect_sel_' + _element.attr('id');
				createWrapper();
				createAvailableBox();
				createSelectedBox();
				if (opt.showMoveButtons) {
					createButtonBoxes();
				}
				if (opt.showFilters) {
					createFilterBoxes();
				}
			} else {
				// if it is already a dualselect object
				_wrapper = _element.closest(opt.wrapperElement + '.' + opt.wrapperClass);
			}
		};
		var createWrapper = function() {
			// create wrapper and insert element in it
			var wrapper = jQuery('<' + opt.wrapperElement + ' class="' + opt.wrapperClass + '"></' + opt.wrapperElement + '>');
			wrapper.insertBefore(_element);
			_wrapper = wrapper;
			_wrapper.append(_element);
		};
		var addOption = function(_e) {
			_e.prop('selected', false);
			jQuery('#' + _dualselect_sel_id).append(_e);
		};
		var removeOption = function(_e) {
			_e.prop('selected', false);
			jQuery('#' + _dualselect_avl_id).append(_e);
		};
		var doSelectOption = function(_all) {
			var options;
			if (_all) {
				options = jQuery('#' + _dualselect_avl_id).find('option:enabled:visible');
			} else {
				options = jQuery('#' + _dualselect_avl_id).find('option:enabled:selected');
			}
			var bs = true;
			options.each(function(idx, elm){
				var _e = jQuery(elm);
				if (bs === true) {
					bs = opt.beforeSelectOption(_e);
				}
			});
			if (bs === true) {
				options.each(function(idx, elm){
					var _e = jQuery(elm);
					var _oe = _element.find('option[value="' + elm.value + '"]');
					addOption(_e);
					_oe.prop('selected', true);
				});
				_element.trigger('change');
			}
		};
		var doRemoveOption = function(_all) {
			var options;
			if (_all) {
				options = jQuery('#' + _dualselect_sel_id).find('option:enabled:visible');
			} else {
				options = jQuery('#' + _dualselect_sel_id).find('option:enabled:selected');
			}
			var bs = true;
			options.each(function(idx, elm){
				var _e = jQuery(elm);
				if (bs === true) {
					bs = opt.beforeRemoveOption(_e);
				}
			});
			if (bs === true) {
				options.each(function(idx, elm){
					var _e = jQuery(elm);
					var _oe = _element.find('option[value="' + elm.value + '"]');
					removeOption(_e);
					_oe.prop('selected', false);
				});
				_element.trigger('change');
			}
		};
		var btnSelectClick = function() {
			doSelectOption(false);
		};
		var btnSelectAllClick = function() {
			doSelectOption(true);
		};
		var btnRemoveClick = function() {
			doRemoveOption(false);
		};
		var btnRemoveAllClick = function() {
			doRemoveOption(true);
		};
		var selectOptions = function() {
			var _select = jQuery(this);
			var _selected_options = _select.find('option:selected');
			if (_select.hasClass(_dualselect_avl_class)) {
				// options are selected from available
				var bs = true;
				_selected_options.each(function(idx, elm){
					var _e = jQuery(elm);
					if (bs === true) {
						bs = opt.beforeSelectOption(_e);
					}
				});
				if (bs === true) {
					_selected_options.each(function(idx, elm){
						var _e = jQuery(elm);
						var _oe = _element.find('option[value="' + elm.value + '"]');
						addOption(_e);
						_oe.prop('selected', true);
					});
					_element.trigger('change');
				}
			} else {
				// options are selected from selected
				var as = true;
				_selected_options.each(function(idx, elm){
					var _e = jQuery(elm);
					if (as === true) {
						as = opt.beforeRemoveOption(jQuery(elm));
					}
				});
				if (as === true) {
					_selected_options.each(function(idx, elm){
						var _e = jQuery(elm);
						var _oe = _element.find('option[value="' + elm.value + '"]');
						removeOption(_e);
						_oe.prop('selected', false);
					});
					_element.trigger('change');
				}
			}
		};
		var createAvailableOptions = function() {
			_element.find('option:not(:selected)').each(function(idx, elm){
				var _e = jQuery(elm).clone();
				removeOption(_e);
			});
		};
		var createSelectedOptions = function() {
			_element.find('option:selected').each(function(idx, elm){
				var _e = jQuery(elm).clone();
				addOption(_e);
			});
		};
		var createAvailableBox = function() {
			// create select available box
			var wrapper = jQuery('<' + opt.wrapperElement + ' class="' + opt.wrapperClass + '-avl"></' + opt.wrapperElement + '>');
			var srcElement = jQuery('<select id="' + _dualselect_avl_id + '" name="' + _dualselect_avl_class + '" class="' + opt.dualselectClass + ' ' + opt.dualselectClass + '-avl ' + _dualselect_avl_class + '" multiple="multiple"></select>');
			wrapper.append(srcElement);
			_wrapper.append(wrapper);
			if (opt.moveOnSelect) {
				srcElement.bind('change', selectOptions);
			}
			createAvailableOptions();
		};
		var createSelectedBox = function() {
			// create selected box
			var wrapper = jQuery('<' + opt.wrapperElement + ' class="' + opt.wrapperClass + '-sel"></' + opt.wrapperElement + '>');
			var selElement = jQuery('<select id="' + _dualselect_sel_id + '" name="' + _dualselect_sel_class + '" class="' + opt.dualselectClass + ' ' + opt.dualselectClass + '-sel '+ ' ' + _dualselect_sel_class + '" multiple="multiple"></select>');
			wrapper.append(selElement);
			_wrapper.append(wrapper);
			if (opt.moveOnSelect) {
				selElement.bind('change', selectOptions);
			}
			createSelectedOptions();
		};
		var createButtonBoxes = function() {
			var btns = jQuery('<' + opt.wrapperElement + ' class="button-wrapper"></' + opt.wrapperElement + '>');
			var btnSelectAll = jQuery('<input id="btn' + _dualselect_sel_id + '_select_all" type="button" value="' + opt.selectAllText + '">');
			var btnSelect = jQuery('<input id="btn' + _dualselect_sel_id + '_select" type="button" value="' + opt.selectText + '">');
			btnSelectAll.bind('click', btnSelectAllClick);
			btnSelect.bind('click', btnSelectClick);
			btns.append(btnSelectAll);
			if (!opt.moveOnSelect) {
				btns.append(btnSelect);
			} else {
				btnSelectAll.addClass('w-100');
			}
			jQuery('#' + _dualselect_avl_id).closest('.' + opt.wrapperClass + '-avl').prepend(btns);

			btns = jQuery('<' + opt.wrapperElement + ' class="button-wrapper"></' + opt.wrapperElement + '>');
			var btnRemove = jQuery('<input id="btn' + _dualselect_sel_id + '_remove" type="button" value="' + opt.removeText + '">');
			var btnRemoveAll = jQuery('<input id="btn' + _dualselect_sel_id + '_remove_all" type="button" value="' + opt.removeAllText + '">');
			btnRemoveAll.bind('click', btnRemoveAllClick);
			btnRemove.bind('click', btnRemoveClick);
			if (!opt.moveOnSelect) {
				btns.append(btnRemove);
			} else {
				btnRemoveAll.addClass('w-100');
			}
			btns.append(btnRemoveAll);
			jQuery('#' + _dualselect_sel_id).closest('.' + opt.wrapperClass + '-sel').prepend(btns);
		};
		var doFilterAvl = function() {
			var avlTxt = jQuery('#' + _dualselect_avl_id + '_filter_text').val();
			if (avlTxt.trim().length > 0) {
				var options = jQuery('#' + _dualselect_avl_id).children();
				options.each(function(idx, elm){
					var _elm = jQuery(elm);
					if (_elm.text().indexOf(avlTxt) >= 0) {
						_elm.show();
					} else {
						_elm.hide();
					}
				});
			} else {
				jQuery('#' + _dualselect_avl_id).children().show();
			}
		};
		var doFilterSel = function() {
			var selTxt = jQuery('#' + _dualselect_sel_id + '_filter_text').val();
			if (selTxt.trim().length > 0) {
				var options = jQuery('#' + _dualselect_sel_id).children();
				options.each(function(idx, elm){
					var _elm = jQuery(elm);
					if (_elm.text().indexOf(selTxt) >= 0) {
						_elm.show();
					} else {
						_elm.hide();
					}
				});
			} else {
				jQuery('#' + _dualselect_sel_id).children().show();
			}
		};
		var createFilterBoxes = function() {
			var avlFilterWrapper = jQuery('<' + opt.wrapperElement + ' class="' + opt.wrapperClass + '-avl-filter" ></' + opt.wrapperElement + '>');
			var selFilterWrapper = jQuery('<' + opt.wrapperElement + ' class="' + opt.wrapperClass + '-sel-filter" ></' + opt.wrapperElement + '>');
			var avlFilter = jQuery('<input type="text" id="' + _dualselect_avl_id + '_filter_text" name="' + _dualselect_avl_id + '_filter_text" >');
			var selFilter = jQuery('<input type="text" id="' + _dualselect_sel_id + '_filter_text" name="' + _dualselect_sel_id + '_filter_text" >');
			avlFilter.bind('keyup change', doFilterAvl);
			selFilter.bind('keyup change', doFilterSel);
			avlFilterWrapper.append(avlFilter);
			selFilterWrapper.append(selFilter);
			_wrapper.find('.' + opt.wrapperClass + '-avl').prepend(avlFilterWrapper);
			_wrapper.find('.' + opt.wrapperClass + '-sel').prepend(selFilterWrapper);
		};

		return this.dualselect();
	}

}(jQuery));
