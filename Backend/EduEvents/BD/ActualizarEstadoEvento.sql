USE EduEvents;
SET GLOBAL event_scheduler = ON;

DELIMITER //
DROP EVENT IF EXISTS actualizarEstadoEvento;

CREATE EVENT IF NOT EXISTS actualizarEstadoEvento
ON SCHEDULE EVERY 1 SECOND STARTS NOW()
ON COMPLETION PRESERVE ENABLE
DO 
BEGIN
	UPDATE Evento SET Estado_Evento = 'Activo' WHERE CURDATE() BETWEEN Fecha_Inicio AND Fecha_Final;
	UPDATE Evento SET Estado_Evento = 'Cerrado' WHERE Fecha_Final < CURDATE();
END //
DELIMITER ;

