import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
const URI = 'http://localhost:5000/clima';

const Inicio = () => {
    const [clima, setClima] = useState(null);
    const [error, setError] = useState(null);
    const [horaSolicitado, setHora] = useState(null);
    const [fechaActual, setFecha] = useState(null);
    const [amanecer, setAmanecer] = useState(null);
    const [atardecer, setAtardecer] = useState(null);
    const [descripcion, setDescripcion] = useState(null);
    const [foreinfo, setForeinfo] = useState(null);
    const [ciudad, setCiudad] = useState("");
    const obtenerUbicacion = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                alert("La geolocalización no es soportada por este navegador.");
                reject(new Error("La geolocalización no es soportada por este navegador."));
            }
        });
    };

    const mostrarUbicacion = async () => {
        try {
            const position = await obtenerUbicacion();
            const { latitude, longitude } = position.coords;
            console.log(`Latitud: ${latitude}, Longitud: ${longitude}`);
            obtenerClima(latitude, longitude);
        } catch (error) {
            setError("Error al obtener la ubicación");
            console.error("Error al obtener la ubicación:", error);
        }
    };

    /*const manejarError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error("El usuario ha denegado la solicitud de geolocalización.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("La información de la ubicación no está disponible.");
                break;
            case error.TIMEOUT:
                console.error("La solicitud de obtener la ubicación ha expirado.");
                break;
            case error.UNKNOWN_ERROR:
                console.error("Ha ocurrido un error desconocido.");
                break;
        }
    };*/

    const obtenerClima = async (latitud, longitud) => {
        try {
            const res = await axios.get(`${URI}?lat=${latitud}&lon=${longitud}`);
            setClima(res.data);
            const horaFormateada = await hora(res.data.dt);
            const fechaFormateada = await Fecha(res.data.dt);
            const descripcionCapi = await Descripcion(res.data.weather[0].description);
            const descripcionPrincipal = await mainDescript(res.data.weather[0].main);
            const amanecerFoo = await hora(res.data.sys.sunrise);
            const atardecerFoo = await hora(res.data.sys.sunset);
            setForeinfo(descripcionPrincipal);//descripcion principal
            setDescripcion(descripcionCapi);//descripcion completa
            setHora(horaFormateada);//formateador de hora
            setFecha(fechaFormateada);//fecha formateada
            setAmanecer(amanecerFoo);
            setAtardecer(atardecerFoo);

        } catch (error) {
            setError("Error al obtener el clima");
            console.error("Error al obtener el clima:", error);
        }
    };

    const Fecha = async(fecha) =>{
        try {
            const dtxUnix = fecha;

            const date = new Date(dtxUnix * 1000);

            const dia = date.getDate();
            const dato = date.getDay();
            const mes = date.getMonth() + 1;
            
            switch (dato) {
                case 1:
                    const Lunes = `Lun. ${dia}/${mes}, `;

                    return Lunes;
                case 2:
                    const Martes = `Mar. ${dia}/${mes}, `;

                    return Martes;
                case 3:
                    const Miercoles = `Mie. ${dia}/${mes}, `;

                    return Miercoles;
                case 4:
                    const Jueves = `Jue. ${dia}/${mes}, `;

                    return Jueves;
                case 5:
                    const Viernes = `Vie. ${dia}/${mes}, `;

                    return Viernes;
                case 6:
                    const Sabado = `Sab. ${dia}/${mes}, `;

                    return Sabado;
                case 7:
                    const Domingo = `Dom. ${dia}/${mes}, `;

                    return Domingo;
                default:
                    return null;   
            }
            
            
        } catch (error) {
            console.error('Error al formatear la hora:', error);
            throw new Error('Error al formatear la hora');
        }
    };
    const Descripcion = async (str) =>{

        if (typeof str !== 'string' || str.length === 0) {
            return '';
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    };

    const mainDescript = async(data) =>{

        switch (data){ //agregar if´s para cada condicion climatica.
            case "Rain":
                const Lluvia = `${process.env.PUBLIC_URL}/imgs/lluvia.png`;
                return Lluvia;
            case "Thunderstorm":
                const Tormenta = `${process.env.PUBLIC_URL}/imgs/tormenta.png`;
                return Tormenta;
            case "Drizzle":
                const Llovizna = `${process.env.PUBLIC_URL}/imgs/llovizna.png`;
                return Llovizna;
            case "Snow": 
                const Nieve = `${process.env.PUBLIC_URL}/imgs/nieve.png`;
                return Nieve;
            case "Atmosphere":
                const Atmos = `${process.env.PUBLIC_URL}/imgs/atmos.png`;
                return Atmos;
            case "Clear":
                const Despejado = `${process.env.PUBLIC_URL}/imgs/despejado.png`;
                return Despejado;
            case "Clouds":
                const Nubes = `${process.env.PUBLIC_URL}/imgs/nubes.png`;
                return Nubes;
            default:
                return null;


        }



    }



    const hora = async (hora) => {
    try {
        // Obtener la marca de tiempo Unix del parámetro hora
        const unixTimestamp = hora;

        // Crear un objeto Date usando la marca de tiempo (multiplicado por 1000 para convertir segundos a milisegundos)
        const date = new Date(unixTimestamp * 1000);

        // Obtener los componentes de la hora
        const horas = date.getHours();
        const minutos = date.getMinutes().toString().padStart(2, '0');;
        


        if(horas>12){
            const horaFormat = `${horas - 12}:${minutos} P.M.`;
            return horaFormat;
        }else{
            const horaFormat = `${horas}:${minutos} A.M.`;
            return horaFormat;
        }
        

        // Retornar la hora formateada
        
    } catch (error) {
        // Manejar errores si ocurren
        console.error('Error al formatear la hora:', error);
        throw new Error('Error al formatear la hora');
    }
};
    useEffect(() => {
        mostrarUbicacion();
    }, []);
    return (
        
        <>
            {error && <p>{error}</p>}
            {clima && (
                <div>
                    <div className='Ciudad'>
                        <h2>{clima.name}, {clima.sys.country}</h2>
                        <div>
                            <input value={ciudad} onChange={ (e)=> setCiudad(e.target.value)} required aria-required placeholder='Buscar una ciudad' type='text' />
                            <Link className='btn-buscar' to={`/ciudad/${ciudad}`} >Buscar</Link>
                            
                        </div>
                        <p>Actualizado hace pocos minutos</p>
                    </div>
                    <div className='Climadata'>
                        <div>
                            <div className='clima-imagen'>
                                <img src={foreinfo} alt='imagen-informacion' ></img>
                                <h2>{(clima.main.temp - 273.15).toFixed(0)}°C</h2>
                            </div>
                            <p>{descripcion}</p>
                        </div>
                        <div className='misce'>
                            <div>
                                <p>{fechaActual} {horaSolicitado}</p>
                                <p>Viento: {clima.wind.speed} km/h</p>
                                <p>Humedad: {clima.main.humidity}%</p>
                            </div>
                            <div>
                                <p>Amanecer: {amanecer}</p>
                                <p>Atardecer: {atardecer} </p>

                            </div>
                        </div>
                        
                    </div>
                </div>
            )}
            
        </>
    );
}

export default Inicio;