DROP DATABASE IF EXISTS EduEvents;

CREATE DATABASE IF NOT EXISTS EduEvents;

USE EduEvents;

CREATE TABLE Persona (
    Id INTEGER AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Apellido VARCHAR(255) NOT NULL,
    Institucion VARCHAR(255) NOT NULL,
    Formacion_Academica ENUM('Primaria','Secundaria','Educación superior') NOT NULL,
    Descripcion TEXT NOT NULL,
    Intereses VARCHAR(255) NOT NULL,
    Fecha_Nacimiento DATE NOT NULL,
    Fotografia LONGBLOB NOT NULL,
    Correo VARCHAR(255) NOT NULL,
    Contrasena BLOB NOT NULL,
    Firma BLOB DEFAULT NULL
) COMMENT "Tabla de Usuarios Registrados";

CREATE TABLE Evento (
    Id INTEGER AUTO_INCREMENT PRIMARY KEY,
    Caratula LONGBLOB NOT NULL,
    Nombre VARCHAR(255) NOT NULL,
    Institucion VARCHAR(255) NOT NULL,
    Descripcion TEXT NOT NULL,
    Fecha_Inicio DATE NOT NULL,
    Fecha_Final DATE NOT NULL,
    Estado_Participantes BOOL NOT NULL,
    Estado_Evento ENUM('Activo', 'Inactivo', 'Cerrado') DEFAULT 'Inactivo' NOT NULL,
    Id_Organizador INTEGER NOT NULL,

    FOREIGN KEY(Id_Organizador) REFERENCES Persona(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) COMMENT "Tabla para gestionar eventos";

CREATE TABLE Lista_Blanca (
    Id INTEGER AUTO_INCREMENT PRIMARY KEY,
    Id_Evento INTEGER NOT NULL,
    Lista_Blanca LONGBLOB NOT NULL,
    FOREIGN KEY (Id_Evento) REFERENCES Evento(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) COMMENT "Tabla para almacenar la lista blanca de los eventos privados";


CREATE TABLE Imagenes_Evento (
    Id INTEGER AUTO_INCREMENT PRIMARY KEY,
    Id_Evento INTEGER NOT NULL,
    Imagen LONGBLOB NOT NULL,

    FOREIGN KEY(Id_Evento) REFERENCES Evento(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE 
) COMMENT "Tabla para almacenar las imágenes publicitarias de cada uno de los eventos";

CREATE TABLE Conferencia (
    Id INTEGER AUTO_INCREMENT PRIMARY KEY,
    Id_Evento INTEGER NOT NULL,
    Tipo BOOL NOT NULL,
    Nombre VARCHAR(255) NOT NULL,
    Descripcion TEXT NOT NULL,
    Modalidad BOOL NOT NULL,
    Medio VARCHAR(255) NOT NULL,
    Correo_Encargado VARCHAR(255) NOT NULL, 
    Fecha_Inicio DATE NOT NULL,
    Hora_Inicio TIME NOT NULL,
    Hora_Final TIME NOT NULL,
    Estado_Conferencia ENUM('Activo', 'Inactivo', 'Finalizado') DEFAULT 'Inactivo' NOT NULL,
    Imagen LONGBLOB NOT NULL, 
    Limite_Participantes INTEGER,
    Firma_Encargado BOOL DEFAULT NULL,
    Firma_Organizador BOOL DEFAULT NULL,
    Emision_Asistencia BOOL DEFAULT 0,
    Emision_Firmas BOOL DEFAULT 0,
    FOREIGN KEY(Id_Evento) REFERENCES Evento(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) COMMENT "Tabla para gestionar las conferencias";

CREATE TABLE Persona_Conferencia (
	Id_Persona INTEGER NOT NULL,
    Id_Conferencia INTEGER NOT NULL,
    Fecha_Inscripcion TIMESTAMP DEFAULT NOW(),
    Asistencia BOOL DEFAULT NULL,
    PRIMARY KEY(Id_Persona, Id_Conferencia),
    
	FOREIGN KEY(Id_Persona) REFERENCES Persona(Id)
		ON DELETE CASCADE
        ON UPDATE CASCADE
	,
    FOREIGN KEY(Id_Conferencia) REFERENCES Conferencia(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) COMMENT "Tabla para gestionar la inscripción de las personas a las conferencias";

CREATE TABLE Reset_Token (
    Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Correo VARCHAR(255) DEFAULT NULL,
    Token VARCHAR(255) DEFAULT NULL,
    Vencimiento DATETIME DEFAULT NULL,
    Creado DATETIME NOT NULL,
    Actualizado DATETIME NULL,
    Usado INT NOT NULL DEFAULT '0'
);
