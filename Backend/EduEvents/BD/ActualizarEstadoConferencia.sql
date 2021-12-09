USE EduEvents;
SET GLOBAL event_scheduler = ON;

DELIMITER //
DROP EVENT IF EXISTS actualizarEstadoConferencia;

CREATE EVENT IF NOT EXISTS actualizarEstadoConferencia
ON SCHEDULE EVERY 1 SECOND STARTS NOW()
ON COMPLETION PRESERVE ENABLE
DO 
BEGIN
	UPDATE Conferencia SET Estado_Conferencia = 'Activo' WHERE Fecha_Inicio = CURDATE() AND CURTIME() BETWEEN Hora_Inicio AND Hora_Final;
	UPDATE Conferencia SET Estado_Conferencia = 'Finalizado' WHERE NOW() > CONCAT(Fecha_Inicio, ' ', Hora_Final);
END //
DELIMITER ;
