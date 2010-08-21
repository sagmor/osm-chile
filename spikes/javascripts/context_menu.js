CM.ContextMenu = function(params){
    
    this.params = params;
};

CM.ContextMenu.prototype = {
        
    show : function(e){

        this.latlng = this.params.map.fromContainerPixelToLatLng(
            new CM.Point(this.params.map._mousePos.x, this.params.map._mousePos.y)
        );
        
        alert(this.latlng.lat() + ', ' +  this.latlng.lng());
    },
    
    hide : function(){
        
        CM.DomEvent.removeListener(this.params.map.getContainer(), 'click', this.hide, this);
        this.latlng = null;
        $(this.context_menu_bg).addClassName('hidden');
        
    }
    
};