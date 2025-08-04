import tracer from 'dd-trace';
import logger from './logger';

// Initialize Datadog tracer
tracer.init({
  service: 'shopping-cart-api',
  env: process.env.NODE_ENV || 'development',
  logInjection: true,
  runtimeMetrics: true,
  profiling: true
});

// Custom Datadog logger that integrates with Winston
export const datadogLogger = {
  info: (message: string, meta?: any) => {
    logger.info(message, { 
      ...meta, 
      service: 'shopping-cart-api',
      dd: {
        trace_id: tracer.scope().active()?.context().toTraceId(),
        span_id: tracer.scope().active()?.context().toSpanId()
      }
    });
  },
  
  warn: (message: string, meta?: any) => {
    logger.warn(message, { 
      ...meta, 
      service: 'shopping-cart-api',
      dd: {
        trace_id: tracer.scope().active()?.context().toTraceId(),
        span_id: tracer.scope().active()?.context().toSpanId()
      }
    });
  },
  
  error: (message: string, meta?: any) => {
    logger.error(message, { 
      ...meta, 
      service: 'shopping-cart-api',
      dd: {
        trace_id: tracer.scope().active()?.context().toTraceId(),
        span_id: tracer.scope().active()?.context().toSpanId()
      }
    });
  },
  
  debug: (message: string, meta?: any) => {
    logger.debug(message, { 
      ...meta, 
      service: 'shopping-cart-api',
      dd: {
        trace_id: tracer.scope().active()?.context().toTraceId(),
        span_id: tracer.scope().active()?.context().toSpanId()
      }
    });
  }
};

// Helper function to add custom metrics
export const addMetric = (name: string, value: number, tags?: string[]) => {
  const span = tracer.scope().active();
  if (span) {
    span.setTag(`custom.${name}`, value);
    if (tags) {
      tags.forEach(tag => span.setTag(tag, true));
    }
  }
};

// Helper function to add custom events
export const addEvent = (name: string, attributes?: Record<string, any>) => {
  const span = tracer.scope().active();
  if (span) {
    span.addTags({
      [`event.${name}`]: true,
      ...attributes
    });
  }
};

export default tracer; 