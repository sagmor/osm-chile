 $(document).ready(function() {
  
    $('.control_buscador .open').click(function(){
      $('.buscador').animate({marginLeft:"0px"},500,"swing");
      $('.wml-map-control').animate({marginLeft:"250px"},500,"swing");
      $(this).hide();
      $('.control_buscador .close').show();

    })
    $('.control_buscador .close').click(function(){
      $('.buscador').animate({marginLeft:"-197px"},500,"swing");
      $('.wml-map-control').animate({marginLeft:"45px"},500,"swing");
     $(this).hide();
      $('.control_buscador .open').show();
    })    
    
    $('.control_estilos .open').click(function(){
      $('.oculta').animate({marginRight:"0px"},500,"swing");
      $(this).hide();
      $('.control_estilos .close').show();

    })
    $('.control_estilos .close').click(function(){
      $('.oculta').animate({marginRight:"-192px"},500,"swing");
       $(this).hide();
      $('.control_estilos .open').show();
    })   
    
     $('.controlador_header .open').click(function(){
      $('.menu').animate({width:"85%"},500,"swing");
      $('.botones').delay(500).fadeIn('fast');
      $(this).hide();
      $('.controlador_header .close').show();

    })
    $('.controlador_header .close').click(function(){
     $('.botones').fadeOut('fast');
      $('.menu').delay(200).animate({width:"300px"},500,"swing");
     $(this).hide();
      $('.controlador_header .open').show();
    })
});
