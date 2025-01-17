$(document).ready(function(){
	
	var token = sessionStorage.getItem("session_token");
	console.log("Token: " +token);

	var selectedId;
	
	var table = $("#dataTable-disciplinas").DataTable({
		ajax: {
			url: '/backend/grades',
		    type: 'GET',
            contentType: 'application/json',
		    headers: {
		    	"Session-Token": token
		    },
		    dataType: 'json',
		    statusCode: {
		    	403: function(response){
		    		console.log(response['status'] +": " +response['message']);
		    	}
		    }
		},
		columns: [
            { "data" : "id" },
            { "data" : "name" },
            { "data" : "course_id" },
            { "data" : "knowledge_id" }
        ]
	});

	$("#dataTable-disciplinas tbody").delegate("tr", "click", function() {
	  	selectedId = $("td:first", this).text();
	});

	$('#dataTable-disciplinas tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
 
    $('#buttonRemove').click( function () {
        
        if (!selectedId) {
            alert("Selecione uma disciplina!");
            return false;
        }
        
        console.log("Removendo disciplina com id: " + selectedId);

        //Abrindo requisição para remoção de núcleo de conhecimento
        var deleteUrl = '/backend/grades/' + selectedId ;
        console.log("Delete URL: " + deleteUrl);

    	$.ajax({
            url: deleteUrl,
            type: 'DELETE',
            contentType: 'application/json',
            headers: {
		    	"Session-Token": token
		    },
            success: function(response){
            	
            }, 
            statusCode: {
            	204: function(response){
            		table.row('.selected').remove().draw( false );
            		alert("Disciplina deletada com sucesso!");
            	},
            	403: function(response){
            		console.log(response['status'] +": " +response['responseJSON']['message']);
            		alert(response['status'] +": " +response['responseJSON']['message']);
            	},
            	404: function(response){
            		console.log(response['status'] +": " +response['responseJSON']['message']);
            		alert(response['status'] +": " +response['responseJSON']['message']);
            	},
            	500: function(response){
            		console.log(response['status'] +": " +response['responseJSON']['message']);
            		alert(response['status'] +": " +response['responseJSON']['message']);
            	}
            }
    	});
    } );
    
    
    $('#buttonEdit').click(function () {

        if (!selectedId) {
            alert("Selecione um registro!");
            return false;
        }
        console.log("Pegar os dados do nucleo com id: " + selectedId);

        var url = '/backend/grade/' + selectedId;
        console.log("URL: " + url);

        $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                "Session-Token": token
            },
            success: function (response) {
                $('#editPopUp').attr('data-id', selectedId);
                $('#editPopUp').attr('data-name', response.name);
                $('#editPopUp').modal();
            },
            statusCode: {
                403: function (response) {
                    console.log(response['status'] + ": " + response['responseJSON']['message']);
                    alert(response['status'] + ": " + response['responseJSON']['message']);
                },
                404: function (response) {
                    console.log(response['status'] + ": " + response['responseJSON']['message']);
                    alert(response['status'] + ": " + response['responseJSON']['message']);
                },
            }
        });
    });
    
    $('#submitAlteracoesModal').click(function () {

        if (!selectedId) {
            alert("Selecione uma disciplina!");
            return false;
        }

        console.log("Editar disciplina com id: " + selectedId);

        $.ajax({
            url: '/backend/grades/' + selectedId,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "Session-Token": token
            },
            data: JSON.stringify({
                'id': selectedId,
                'name': $("#name").val(),
            }),
            success: function (response) {
                console.log("Núcleo Editado com sucesso");
                $('#editPopUp').modal('toggle');
                $('#finalPopUpEdit').modal();
            },
            statusCode: {
                201: function (response, status, xhr) {
                    console.log("201");
                    console.log(response);
                },
                400: function (response) {
                    console.log(response['status'] + ": " + response['responseJSON']['message']);
                    alert(response['status'] + ": " + response['responseJSON']['message']);
                },
                403: function (response) {
                    console.log(response['status'] + ": " + response['responseJSON']['message']);
                    alert(response['status'] + ": " + response['responseJSON']['message']);
                },
                404: function (response) {
                    console.log(response['status'] + ": " + response['responseJSON']['message']);
                    alert(response['status'] + ": " + response['responseJSON']['message']);
                }
            },
            complete: function (xhr) {

            }
        });

    });

    $('#editPopUp').on('show.bs.modal', function (event) {
        $('#id').val($(this).attr('data-id'));
        $('#name').val($(this).attr('data-name'));
       
    });
    
    
});


