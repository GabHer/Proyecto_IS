USE eduevents;
DROP PROCEDURE IF EXISTS SP_Crear_Evento;
DELIMITER $$
CREATE  PROCEDURE SP_Crear_Evento( IN Caratula longblob, IN Nombre VARCHAR(255), IN Institucion VARCHAR(255), IN Descripcion VARCHAR(255), IN Fecha_Inicio DATE, IN Fecha_Final DATE, IN Estado_Participantes BOOL, IN Estado_Evento VARCHAR(10), IN Id_Organizador INTEGER, IN Lista_Blanca LONGBLOB)

BEGIN
    INSERT INTO Evento (
        Caratula,
        Nombre,
        Institucion,
        Descripcion,
        Fecha_Inicio,
        Fecha_Final,
        Estado_Participantes,
        Estado_Evento,
        Id_Organizador
        ) VALUES 
        (
        Caratula, Nombre, Institucion, Descripcion, Fecha_Inicio, Fecha_Final, Estado_Participantes, Estado_Evento, Id_Organizador
    );


    IF Estado_Participantes = 0 THEN
        INSERT INTO Lista_Blanca (Id_Evento, Lista_Blanca ) VALUES ( (SELECT MAX(Id) FROM Evento), Lista_Blanca);
    END IF;

END$$

DELIMITER ; $$