USE EduEvents;
SET GLOBAL event_scheduler = ON;

DELIMITER //
DROP EVENT IF EXISTS actualizarEstadoEvento;

CREATE EVENT IF NOT EXISTS actualizarEstadoEvento
ON SCHEDULE EVERY 1 SECOND STARTS '2021-11-01'
ENDS '2021-12-31'
ON COMPLETION PRESERVE ENABLE
DO 
BEGIN
	UPDATE Evento SET Estado_Evento = 'Activo' WHERE Fecha_Inicio <= NOW() AND Fecha_Final >= NOW();
	UPDATE Evento SET Estado_Evento = 'Cerrado' WHERE Fecha_Final < NOW();
END //
DELIMITER ;

SHOW events;
