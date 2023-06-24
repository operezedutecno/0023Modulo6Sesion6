const yargs = require("yargs")
const { v4: uuid} = require("uuid")
const fs = require("fs")

// console.log(uuid().slice(0,8));

yargs
    .command("crear", "Comando para crear personas", 
        {
            rut: {
                alias:"r",
                describe: "Rut de la persona a registrar",
                type: "string",
                demandOption: true
            },
            nombre: {
                alias: "n",
                describe: "Nombre de la persona a registrar",
                type: "string",
                demandOption: true
            },
            apellido: {
                alias: "a",
                describe: "Apellido de la persona a registrar",
                type: "string",
                demandOption: true
            }
        },
        ({ rut, nombre, apellido}) => {
            const data = fs.readFileSync("files/personas.txt","utf8")
            const arreglo = JSON.parse(data)

            // Validar que se esté registrando un RUT válido
            // Validar que el RUT no exista en el archivo
            arreglo.push({
                id: uuid().slice(0,8),
                rut: rut,
                nombre: nombre,
                apellido: apellido
            })
            const registro = JSON.stringify(arreglo)
            fs.writeFileSync("files/personas.txt", registro,"utf8")
        }
    )
    .command("listar", "Comando para listar personas", {}, () => {
        const data = fs.readFileSync("files/personas.txt","utf8")
        const arreglo = JSON.parse(data)
        console.table(arreglo);
    })
    .command("actualizar", "Comando para actualizar persona",
        {
            id: {
                alias: "i",
                describe: "Id de la persona a modificar",
                type: "string",
                demandOption: true
            },
            nombre: {
                alias: "n",
                describe: "Nombre de la persona a modificar",
                type: "string",
                demandOption: false
            },
            apellido: {
                alias: "a",
                describe: "Apellido de la persona a modificar",
                type: "string",
                demandOption: false
            }
        },
        ({ id, nombre, apellido}) => {
            //Validar que se reciba al menos uno de los 2 campos (nombre,apellido)

            const data = fs.readFileSync("files/personas.txt","utf8")
            const arreglo = JSON.parse(data)

            const indice = arreglo.findIndex(persona => persona.id == id)

            //Opción 1 para editar
            arreglo[indice] = { 
                ...arreglo[indice], 
                nombre: nombre || arreglo[indice].nombre, 
                apellido: apellido || arreglo[indice].apellido
            }

            //Opción 2 para editar
            // if(nombre !== undefined)
            //     arreglo[indice].nombre = nombre
            // if(apellido !== undefined)
            //     arreglo[indice].apellido = apellido

            const registro = JSON.stringify(arreglo)
            fs.writeFileSync("files/personas.txt", registro, "utf8")
            console.log("Persona modificada con éxito");
            console.table(arreglo[indice]);
        }
    )
    .command(
        "eliminar", 
        "Comando para eliminar persona",
        {
            id: {
                alias: "i",
                describe: "Id de la persona a eliminar",
                type: "string",
                demandOption: true
            }
        },
        ({ id }) => {
            const data = fs.readFileSync("files/personas.txt","utf8")
            const arreglo = JSON.parse(data)
            const indice = arreglo.findIndex(elemento => elemento.id == id)
            
            //Cuando no conseguimos una persona retornamos un error
            if(indice == -1)
                return console.log("El Id no existe en el registro de personas, no se pudo eliminar");
            
            //Eliminar un elemento del arreglo
            const eliminado = arreglo.splice(indice, 1)
            const registro = JSON.stringify(arreglo)

            fs.writeFileSync("files/personas.txt", registro, "utf8")
            console.log("Persona eliminada con éxito");
            console.table(eliminado);
        }
    )
    .help()
    .argv