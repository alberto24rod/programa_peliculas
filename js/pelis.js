const fila = document.querySelector('.contenedor-carousel');
const peliculas = document.querySelectorAll('.pelicula');

const flechaIzquierda = document.getElementById('flecha-izquierda');
const flechaDerecha = document.getElementById('flecha-derecha');

/* ----- ----- Evento para la flecha derecha.---- 
----- --------------------------------------------------------*/
flechaDerecha.addEventListener('click', () => {
	fila.scrollLeft += fila.offsetWidth;

	const indicadorActivo = document.querySelector('.indicadores .activo');
	if(indicadorActivo.nextSibling){
		indicadorActivo.nextSibling.classList.add('activo');
		indicadorActivo.classList.remove('activo');
	}
});

/* ----- ----- Evento para la flecha izquierda.---- 
----- --------------------------------------------------------*/
flechaIzquierda.addEventListener('click', () => {
	fila.scrollLeft -= fila.offsetWidth;

	const indicadorActivo = document.querySelector('.indicadores .activo');
	if(indicadorActivo.previousSibling){
		indicadorActivo.previousSibling.classList.add('activo');
		indicadorActivo.classList.remove('activo');
	}
});

class Video {
    constructor(link, description, thumbnail) {
        this.link = link;
        this.description = description;
        this.thumbnail = thumbnail;
        this.element = null; //  referencia al elemento del video
    }

	
    render() {
        const videoList = document.getElementById('videoList');

        const videoItem = document.createElement('div');
        videoItem.classList.add('videoItem');

        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = this.thumbnail;
        thumbnailImg.alt = this.description;
        thumbnailImg.onclick = () => this.playVideo();

        const descriptionPara = document.createElement('p');
        descriptionPara.textContent = this.description;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => this.editDescription();

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => this.deleteVideo();

        videoItem.appendChild(thumbnailImg);
        videoItem.appendChild(descriptionPara);
        videoItem.appendChild(editButton);
        videoItem.appendChild(deleteButton);

        videoList.appendChild(videoItem);

        this.element = videoItem; // Guardamos una referencia al elemento del video
    }

    playVideo() {
        const videoContainer = document.getElementById('videoContainer');
        videoContainer.innerHTML = `<div id="player"></div>`;
        
        const player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: this.extractVideoId(),
            events: {
                'onReady': onPlayerReady,
            }
        });

        function onPlayerReady(event) {
            event.target.playVideo();
        }
    }

    extractVideoId() {
        // Extrae el ID del video de un enlace de YouTube
        const videoIdMatch = this.link.match(/(?:\?v=|\/embed\/|\.be\/)([-a-zA-Z0-9_]+)/);
        if (videoIdMatch) {
            return videoIdMatch[1];
        } else {
            return null;
        }
    }

    editDescription() {
        const newDescription = prompt("Introduce la nueva descripción:", this.description);
        if (newDescription !== null) {
            this.description = newDescription;
            this.element.querySelector('p').textContent = this.description; // Actualizamos la descripción en el elemento existente
        }
    }

    deleteVideo() {
        if (confirm("¿Estás seguro de eliminar este video?")) {
            const videoList = document.getElementById('videoList');
            videoList.removeChild(this.element);
        }
    }
}

function addVideo() {
    const linkInput = document.getElementById('videoLink');
    const descriptionInput = document.getElementById('videoDescription');
    const thumbnailInput = document.getElementById('videoThumbnail');

    const link = linkInput.value;
    const description = descriptionInput.value;
    const thumbnailFile = thumbnailInput.files[0];

    if (link && description && thumbnailFile) {
        const thumbnail = URL.createObjectURL(thumbnailFile);
        const video = new Video(link, description, thumbnail);
        video.render();

        // Limpiar los campos después de agregar el video
        linkInput.value = '';
        descriptionInput.value = '';
        thumbnailInput.value = '';
    } else {
        alert("Por favor completa todos los campos");
    }
}







// ? ----- ----- Paginacion ----- -----
const numeroPaginas = Math.ceil(peliculas.length / 5);
for(let i = 0; i < numeroPaginas; i++){
	const indicador = document.createElement('button');

	if(i === 0){
		indicador.classList.add('activo');
	}

	document.querySelector('.indicadores').appendChild(indicador);
	indicador.addEventListener('click', (e) => {
		fila.scrollLeft = i * fila.offsetWidth;

		document.querySelector('.indicadores .activo').classList.remove('activo');
		e.target.classList.add('activo');
	});
}

// ? ----- ----- Hover ----- -----
peliculas.forEach((pelicula) => {
	pelicula.addEventListener('mouseenter', (e) => {
		const elemento = e.currentTarget;
		setTimeout(() => {
			peliculas.forEach(pelicula => pelicula.classList.remove('hover'));
			elemento.classList.add('hover');
		}, 300);
	});
});

fila.addEventListener('mouseleave', () => {
	peliculas.forEach(pelicula => pelicula.classList.remove('hover'));
});