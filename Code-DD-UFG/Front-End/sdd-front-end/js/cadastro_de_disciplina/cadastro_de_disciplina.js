var app = angular.module('cadastroDisciplina', []);

app.controller('cadastroDisciplinaController', function($scope){

	$scope.submitForm = function(isValid){
		if(isValid){
			console.log("Código: " + $("#codigoDaDisciplina").val());
			console.log("Disciplina: " + $("#nomeDaDisciplina").val());
			console.log("Carga horária: " + $("#seletorDeCargaHoraria").val());
			console.log("Curso: " + $("#seletorDoSemestre").val());

			var token = sessionStorage.getItem("session_token");
			console.log("Token: " + token);

			$.ajax({
	            url: '/backend/grades',
	            type: 'POST',
	            dataType: 'json',
	            contentType: 'application/json',
	            headers: {
					"Session-Token": token
	            },
	            data: JSON.stringify({
	            	"name": $("#nomeDaDisciplina").val(),
	            	"course_id": $("#seletorDoSemestre").val(),
	            	"knowledge_id": 1
	            }),
	            success: function(response){
	            	console.log("Success ajax1");
	            }, 
	            statusCode: {
	            	201: function(response){
	            		console.log("201");
	            		console.log(response);
	            		//alert(xhr.getResponseHeader('Location'));
	            	},
	            	400: function(response){
	        			console.log(response['status'] +": " +response['responseJSON']['message']);
	        			alert(response['status'] +": " +response['responseJSON']['message']);
	            	},
	            	403: function(response){
	        			console.log(response['status'] +": " +response['responseJSON']['message']);
	        			alert(response['status'] +": " +response['responseJSON']['message']);
	            	}
	            },
	            complete: function(xhr){
					if(xhr.getResponseHeader('Location')){
						
						var location = xhr.getResponseHeader('Location');
						console.log("Location: " + location);

						var arr = location.split('/');
						console.log("Array: " + arr[2]);

						var senhaDigest = sha1($("#senha").val());
						console.log("SenhaDigest: " + senhaDigest);

						$.ajax({
				            url: '/backend/users',
				            type: 'POST',
				            dataType: 'json',
				            contentType: 'application/json',
				            headers: {
						    	"Session-Token": token
						    },
						    data: JSON.stringify({
						    	'username': $("#username").val(),
						    	'password': senhaDigest,
						    	'email': $("#email").val(),
						    	'teacher_id': arr[2]
						    }),
				            success: function(response){
				            	console.log("Success ajax2");
				            }, 
				            statusCode: {
				            	201: function(response){
				            		console.log("201");
	            					console.log(response);
				            	},
				            	400: function(response){
				            		console.log(response['status'] +": " +response['responseJSON']['message']);
				            		alert(response['status'] +": " +response['responseJSON']['message']);
				            	}
				            }
				    	});
					}
	            }
	    	});
		}
	};
});
