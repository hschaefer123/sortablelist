sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/thirdparty/jqueryui/jquery-ui-core",
	"sap/ui/thirdparty/jqueryui/jquery-ui-widget",
	"sap/ui/thirdparty/jqueryui/jquery-ui-mouse",
	"sap/ui/thirdparty/jqueryui/jquery-ui-sortable", // http://api.jqueryui.com/sortable/
	"../control/3rd/jquery.ui.touch-punch.min" // http://touchpunch.furf.com/
	//"../control/3rd/jquery.mobile-events.min"			// https://github.com/benmajor/jQuery-Touch-Events
], function(Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("de.blogspot.openui5.sortablelist.controller.App", {

		onInit: function() {
			this._oSortableList = this.getView().byId("idSortableList");

			// generate demo data
			var aItems = [];

			for (var i = 1; i <= 8; i++) {
				aItems.push({
					ID: i.toString(),
					title: "Item " + i,
					description: "Description " + i
				});
			}

			// ui model
			var oUIModel = new JSONModel({
				"SortableItems": aItems
			});
			this.getView().setModel(oUIModel, "ui");

			// initialize list and attach functionality
			this._initListDragDrop(this._oSortableList);
		},

		/* ########## event handler ######################################## */

		onListItemDelete: function(oEvent) {
			var oList = oEvent.getSource().getParent(),
				oListItem = oList.getSwipedItem(),
				oBindingContext = oListItem.getBindingContext("ui");

			MessageToast.show("Delete item with id " + oBindingContext.getObject().ID);
			oList.removeAggregation("items", oListItem);
			oList.swipeOut();
		},

		onListItemPositionChange: function(iFrom, iTo) {
			var bServserSideUpdate = false;

			// if you do backend reorganisation thats needs to reload/rebind items
			// do a list rerender to reflect changes from model to ui
			if (bServserSideUpdate) {
				this._oSortableList.rerender();
			}

			MessageToast.show("drag from " + iFrom + " to " + iTo);
		},

		/* ########## private methods ######################################## */

		/**
		 * initialize the status list drag&drop handling
		 * @private
		 */
		_initListDragDrop: function(oList) {
			oList.addEventDelegate({
				"onAfterRendering": function() {
					var sId = oList.getId();
					$("#" + sId + " .sapMListUl").addClass("ui-sortable");

					// disable selection on list items and attach sortable
					$(".ui-sortable").disableSelection();
					$(".ui-sortable").sortable({
						// only drag vertically
						axis: "y",
						// do not allow dragging of GroupHeader and playing item
						//cancel: ".sapMLIBTypeInactive",
						// only drag inside list
						containment: "parent",
						// handle class (use as grippy)
						handle: ".sapMSLIImgIcon",
						// events: start, change, update
						start: function(event, ui) {
							var iStartPos = ui.item.index();
							// cache start pos using customdata for update
							ui.item.data("startPos", iStartPos);
							//console.log(event, ui);
						},
						update: function(event, ui) {
							// get startpos from customdata (set inside start event)
							var iStartPos = ui.item.data("startPos"),
								iNewPos = ui.item.index();
								
							this.onListItemPositionChange(iStartPos, iNewPos);
						}.bind(this)
					});
				}
			}, this);
		}

	});
});