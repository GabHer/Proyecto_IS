SET GLOBAL event_scheduler = ON;

DELIMITER //
DROP EVENT IF EXISTS actualizarEstadoConferencia;

CREATE EVENT IF NOT EXISTS actualizarEstadoConferencia
ON SCHEDULE EVERY 1 SECOND STARTS '2021-11-01'
ENDS '2021-12-31'
ON COMPLETION PRESERVE ENABLE
DO 
BEGIN
	UPDATE Conferencia SET Estado_Conferencia = 'Activo' WHERE Fecha_Inicio <= NOW() AND Hora_Inicio = NOW();
	UPDATE Conferencia SET Estado_Conferencia = 'Finalizado' WHERE Hora_Final < NOW();
END //
DELIMITER ;

SHOW events;