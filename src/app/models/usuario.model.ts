

export class Usuario {
    // método estático para obtener una nueva instancia de usuario
    static fromFirebase( { uid, nombre, email } ) {
      return new Usuario( uid, nombre, email )
    }

    constructor(

        public uid: string,
        public nombre: string,
        public email: string

    ){}
}
