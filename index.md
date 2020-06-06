# dualselect

**dualselect** is a [jQuery](https://jquery.com/) plugin to convert the look n feel of traditional multi select to a fancy dual box select.

## How to use

To use with default features use
```javascript
var select1 = jQuery('#select1').dualselect();
```

You can also use collection as well
```javascript
var selects = jQuery('#select1,#select2').dualselect();
```

To **remove** the plugin and use the traditional one
```javascript
var select1 = jQuery('#select1').dualselect();
select1.destroy();
```

## Parameters

`dualselectClass` : CSS class to be applied, when element is converted to dualselect. Default is `is-dualselect`.

`wrapperElement` : HTML element wrapping the dualselect. Default is `div`.

`wrapperClass` : CSS class applied on the wrapping element. Default is `dualselect-wrapper`.

`showFilters` : Show filter boxes. Default is `true`.

`moveOnSelect` : As soon as option(s) are selected, they are immediatly moved to the selection element. Default is `true`.
	If `showMoveButtons` is `false` then this can not be `false`.

`showMoveButtons` : Show the buttons for selecting and unselecting the options. Default is `true`.
	If `moveOnSelect` is `false` then this can not be `false`.

`selectText` : Text appearing on the select button. Default is `&gt;` _html code for &gt;_.

`selectAllText` : Text appearing on the select all button. Default is `&gt;&gt;` _html code for &gt;&gt;_.

`removeText` : Text appearing on the unselect/remove button. Default is `&lt;` _html code for &lt;_.

`removeAllText` : Text appearing on the unselect/remove button. Default is `&lt;&lt;` _html code for &lt;&lt;_.

`beforeSelectOption` : Function to be called before making the selections of option(s). Function should return `true` in order to select the option, otherwise `false`. Option is passed as an argument to the function as 
```html
<select id="limitedSelect" name="limitedSelect" multiple="multiple" size="10">
	<option value="0" selected>Option A</option>
	<option value="20">Option B</option>
	<option value="40">Option C</option>
	<option value="60">Option D</option>
	<option value="80">Option E</option>
	<option value="100">Option F</option>
</select>
```
```javascript
var limitedSelect = jQuery('#limitedSelect').dualselect({
	beforeSelectOption : function(opt) {
		if(opt.val()>50) {
			alert('Option of value greate than 50 is not allowed to be selected.');
			return false;
		} else {
			// allowed option
			return true;
		}
	}
});
```
`beforeRemoveOption` : Function to be called removing the option(s). Function should return `true` in order to unselect/remove the option, otherwise `false`. Option is passed as an argument to the function as
```html
<select id="limitedSelect" name="limitedSelect" multiple="multiple" size="10">
	<option value="0">Option A</option>
	<option value="20">Option B</option>
	<option value="40" selected>Option C</option>
	<option value="60" selected>Option D</option>
	<option value="80">Option E</option>
	<option value="100">Option F</option>
</select>
```
```javascript
function brm(opt) {
	if(opt.val()>50) {
		alert('Option of value greate than 50 is not allowed to be removed.');
		return false;
	} else {
		// removal of option allowed
		return true;
	}
}
var limitedSelect = jQuery('#limitedSelect').dualselect({
	beforeRemoveOption : brm
});
```

## Methods
`resync` : Refreshes or reinitializes the dualselect with the core html element. This is helpful if some other function and/or event modifies the main control and we now need to show the effect of it.
```javascript
var select1 = jQuery('#select1').dualselect();
select1.resync();
```
