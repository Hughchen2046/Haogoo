import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const Mixed = ({ etfData = [], start = false, onClick }) => {
  const containerRef = useRef(null);
  const tagsRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // 使用 ResizeObserver 監聽父容器尺寸變化
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: width,
          height: height > 350 ? height : 350,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!etfData || etfData.length === 0 || dimensions.width === 0 || !start) return;

    const { Engine, Runner, MouseConstraint, Mouse, Composite, Bodies, Events } = Matter;
    const { width, height } = dimensions;

    const engine = Engine.create();
    const { world } = engine;

    const tagBodies = etfData.map((etf, i) => {
      const text = etf.name || etf.id;
      const bodyWidth = text.length * 18 + 30;
      const bodyHeight = 40;

      const x = 50 + Math.random() * (width - 100);
      const y = -50 - i * 40;

      const body = Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
        chamfer: { radius: 20 },
        restitution: 0.5,
        friction: 0.1,
      });

      body.label = etf.id;
      body.displayText = text;
      return body;
    });

    Composite.add(world, tagBodies);

    const wallThickness = 100;
    Composite.add(world, [
      Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, {
        isStatic: true,
      }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true,
      }),
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true,
      }),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '10';
    canvas.style.pointerEvents = 'none';
    canvas.style.cursor = 'default';
    containerRef.current.appendChild(canvas);

    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(world, mouseConstraint);

    let startTime = 0;
    Events.on(mouseConstraint, 'mousedown', () => {
      startTime = Date.now();
      setIsDragging(true);
    });

    Events.on(mouseConstraint, 'mouseup', () => {
      const duration = Date.now() - startTime;
      setIsDragging(false);

      if (duration < 200 && mouseConstraint.body && mouseConstraint.body.label) {
        const stockId = mouseConstraint.body.label;
        if (onClick) {
          onClick(stockId);
        }
      }
    });

    Events.on(engine, 'afterUpdate', () => {
      tagBodies.forEach((body, i) => {
        const el = tagsRef.current[i];
        if (el) {
          const { x, y } = body.position;
          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
        }
      });

      const hoveredBody = Matter.Query.point(tagBodies, mouse.position)[0];

      if (mouseConstraint.body) {
        canvas.style.cursor = 'grabbing';
        canvas.style.pointerEvents = 'auto';
      } else if (hoveredBody) {
        canvas.style.cursor = 'grab';
        canvas.style.pointerEvents = 'auto';
      } else {
        canvas.style.cursor = 'default';
        canvas.style.pointerEvents = 'none';
      }
    });

    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(world);
      if (canvas) canvas.remove();
    };
  }, [etfData, dimensions, start, onClick]);

  const handleTagClick = (etf, e) => {
    e.preventDefault();
    if (onClick) {
      onClick(etf.id);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-100 h-100 position-absolute top-0 start-0 overflow-hidden"
      style={{ minHeight: '350px' }}
    >
      {etfData.map((etf, i) => (
        <a
          key={etf.id || i}
          ref={(el) => (tagsRef.current[i] = el)}
          href={`#${etf.id}`}
          className="text-decoration-none round-pill btn btn-light py-8 h5 px-16 etfsTag border-gray-800 position-absolute"
          style={{
            left: '0',
            top: '0',
            whiteSpace: 'nowrap',
            pointerEvents: isDragging ? 'none' : 'auto',
            zIndex: 5,
            transformOrigin: 'center center',
            fontSize: dimensions.width < 400 ? '14px' : '16px',
            visibility: dimensions.width === 0 ? 'hidden' : 'visible',
            cursor: 'pointer',
          }}
          onClick={(e) => handleTagClick(etf, e)}
        >
          {etf.name || etf.id}
        </a>
      ))}
    </div>
  );
};

export default Mixed;
