jQuery(document).ready(function($) {
    $('#upload-glsl-button').click(function(e) {
        e.preventDefault();

        // Crée un formulaire pour envoyer le fichier
        var formData = new FormData();
        var glslFileInput = $('#glsl-file-input')[0].files[0];

        if (!glslFileInput) {
            alert('Veuillez sélectionner un fichier GLSL.');
            return;
        }

        formData.append('action', 'upload_glsl');
        formData.append('glsl_file', glslFileInput);

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: formData,
            processData: false, // Prévenir jQuery d'essayer de traiter les données
            contentType: false, // Prévenir jQuery de définir le type de contenu
            success: function(response) {
                if (response.success) {
                    alert(response.data); // Affiche le message de succès
                } else {
                    alert('Erreur: ' + response.data); // Affiche le message d'erreur
                }
            },
            error: function(error) {
                console.log('Erreur:', error);
            }
        });
    });
});
