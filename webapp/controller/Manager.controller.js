sap.ui.define(
  [
    "intern2020/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageToast",
  ],
  function (
    BaseController,
    Filter,
    FilterOperator,
    Sorter,
    JSONModel,
    ResourceModel,
    MessageToast
  ) {
    "use strict";

    return BaseController.extend("intern2020.controller.Manager", {
      onInit: function (oContext) {
         this.aFilter=[];
        
        this.getRouter()
          .getRoute("manager")
          .attachPatternMatched(this.checkLoginManager, this);
      },

      
     
      onGoToLogin: function (oEvent) {
        this.logOut();
        var oRouter = this.getRouter();
        oRouter.navTo("login");
      },

      onFilterData: function (oEvent) {
        // build filter array
        
        var buton_pressed=oEvent.getSource().getProperty().getText();
        var buton_active=oEvent.getSource().getProperty().getPressed();
        //console.log(oEvent.oSource.mProperties.text);
       console.log(oEvent);
        
        if(buton_pressed="Approved" && buton_active==true){
        
          this.aFilter.push(new Filter("Status", FilterOperator.EQ, '1'));
          
        }
        else if (buton_pressed="To Be Aproved" && buton_active==true){
          this.aFilter.push(new Filter("Status", FilterOperator.EQ, '0'));

        }
        else if(buton_pressed="Declined" && buton_active==true)
        {
          this.aFilter.push(new Filter("Status", FilterOperator.EQ, '2'));
        }
        //console.log(aFilter);
        
    
        // filter binding
        var oList = this.byId("idTrips");
        var oBinding = oList.getBinding("items");
        oBinding.filter(this.aFilter);
        
      },
      onFilterSearch: function(oEvent){
        // build filter array
			
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				this.aFilter.push(new Filter("Country", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("idTrips");
			var oBinding = oList.getBinding("items");
			oBinding.filter(this.aFilter);
      },

      onPressDetail: function (oEvent) {
        var sID = oEvent.getSource().getBindingContext().getObject().RId;

        var oRouter = this.getRouter();
        oRouter.navTo("detail", {
          sId: sID,
          
        });
      },

      onReset: function (oEvent) {
        this.bGrouped = false;
        this.bDescending = false;
        this.sSearchQuery = 0;
        this.byId("UId").setValue("");
        this.fnApplyFiltersAndOrdering();
      },

      onGroup: function (oEvent) {
        this.bGrouped = !this.bGrouped;
        this.fnApplyFiltersAndOrdering();
      },

      onSort: function (oEvent) {
        this.bDescending = !this.bDescending;
        this.fnApplyFiltersAndOrdering();
      },

      onFilter: function (oEvent) {
        this.sSearchQuery = oEvent.getSource().getValue();
        this.fnApplyFiltersAndOrdering();
      },

      

      fnApplyFiltersAndOrdering: function (oEvent) {
        var aFilters = [],
          aSorters = [];

        if (this.bGrouped) {
          aSorters.push(new Sorter("UId", this.bDescending, this._fnGroup));
        } else {
          aSorters.push(new Sorter("Country", this.bDescending));
        }

        if (this.sSearchQuery) {
          var oFilter = new Filter(
            "RId",
            FilterOperator.Contains,
            this.sSearchQuery
          );
          aFilters.push(oFilter);
        }

        this.byId("idTrips")
          .getBinding("items")
          .filter(aFilters)
          .sort(aSorters);
      },

    });

    return OverflowToolbarController;
  }
);
