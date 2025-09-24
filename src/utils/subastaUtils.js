// Utilidades para manejo de subastas

export function validarPuja(subasta, cantidad, usuarioId) {
  const errors = [];
  
  // Verificar estado de subasta
  if (subasta.estado !== 'activa') {
    errors.push('La subasta no está activa');
    return { valida: false, errors };
  }
  
  // Verificar tiempo
  const ahora = new Date();
  const finSubasta = new Date(subasta.termina);
  if (ahora >= finSubasta) {
    errors.push('La subasta ha finalizado');
    return { valida: false, errors };
  }
  
  // Verificar cantidad mínima
  const minimaRequerida = subasta.precioActual + subasta.incrementoMinimo;
  if (cantidad < minimaRequerida) {
    errors.push(`La puja mínima es €${minimaRequerida.toLocaleString()}`);
  }
  
  // Verificar que no sea la misma persona que la última puja
  if (subasta.pujas.length > 0) {
    const ultimaPuja = subasta.pujas[subasta.pujas.length - 1];
    if (ultimaPuja.usuarioId === usuarioId) {
      errors.push('No puedes pujar dos veces seguidas');
    }
  }
  
  return {
    valida: errors.length === 0,
    errors
  };
}

export function aplicarReglasAntiUltimoSegundo(subasta, nuevaPuja) {
  const ahora = new Date();
  const finSubasta = new Date(subasta.termina);
  const tiempoRestante = finSubasta - ahora;
  
  // Si quedan menos de 60 segundos, extender 30 segundos
  if (tiempoRestante < 60000) { // 60 segundos en ms
    const nuevaHoraFin = new Date(ahora.getTime() + 30000); // +30 segundos
    return {
      ...subasta,
      termina: nuevaHoraFin.toISOString(),
      precioActual: nuevaPuja.cantidad,
      pujas: [...subasta.pujas, nuevaPuja]
    };
  }
  
  return {
    ...subasta,
    precioActual: nuevaPuja.cantidad,
    pujas: [...subasta.pujas, nuevaPuja]
  };
}

export function calcularTiempoRestante(fechaFin) {
  const ahora = new Date();
  const fin = new Date(fechaFin);
  const diferencia = fin - ahora;
  
  if (diferencia <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const days = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diferencia % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total: diferencia };
}

export function formatearTiempoRestante(tiempo) {
  if (tiempo.total <= 0) return 'Finalizada';
  
  if (tiempo.days > 0) {
    return `${tiempo.days}d ${tiempo.hours}h ${tiempo.minutes}m`;
  } else if (tiempo.hours > 0) {
    return `${tiempo.hours}h ${tiempo.minutes}m`;
  } else if (tiempo.minutes > 0) {
    return `${tiempo.minutes}m ${tiempo.seconds}s`;
  } else {
    return `${tiempo.seconds}s`;
  }
}

export function obtenerEstadoSubasta(subasta) {
  const ahora = new Date();
  const inicio = new Date(subasta.empieza);
  const fin = new Date(subasta.termina);
  
  if (ahora < inicio) {
    return 'programada';
  } else if (ahora >= fin) {
    return 'finalizada';
  } else {
    return 'activa';
  }
}

export function simularPujaAutomatica(subasta) {
  // Solo para subastas activas con actividad reciente
  if (subasta.estado !== 'activa' || subasta.pujas.length === 0) {
    return null;
  }
  
  const ultimaPuja = subasta.pujas[subasta.pujas.length - 1];
  const tiempoUltimaPuja = new Date() - new Date(ultimaPuja.hora);
  
  // Solo simular si han pasado al menos 2 minutos
  if (tiempoUltimaPuja < 2 * 60 * 1000) {
    return null;
  }
  
  // 20% de probabilidad de puja automática
  if (Math.random() > 0.2) {
    return null;
  }
  
  const incrementoAleatorio = subasta.incrementoMinimo + Math.floor(Math.random() * subasta.incrementoMinimo);
  const nuevaCantidad = subasta.precioActual + incrementoAleatorio;
  
  // Usuarios simulados para pujas automáticas
  const usuariosBot = [10, 11, 12, 13, 14]; // IDs ficticios
  const usuarioAleatorio = usuariosBot[Math.floor(Math.random() * usuariosBot.length)];
  
  return {
    usuarioId: usuarioAleatorio,
    cantidad: nuevaCantidad,
    hora: new Date().toISOString()
  };
}
