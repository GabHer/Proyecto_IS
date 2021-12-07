USE EduEvents;
SET GLOBAL event_scheduler = ON;

DELIMITER //
DROP EVENT IF EXISTS actualizarEstadoConferencia;

CREATE EVENT IF NOT EXISTS actualizarEstadoConferencia
ON SCHEDULE EVERY 1 SECOND STARTS NOW()
ON COMPLETION PRESERVE ENABLE
DO 
BEGIN
	UPDATE Conferencia SET Estado_Conferencia = 'Activo' WHERE Fecha_Inicio = CURDATE() AND Hora_Inicio <= CURTIME();
	UPDATE Conferencia SET Estado_Conferencia = 'Finalizado' WHERE CURDATE() >= Fecha_Inicio AND CURTIME() > Hora_FINAL;

END //
DELIMITER ;