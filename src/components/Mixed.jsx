import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const Mixed = ({ tags = [], start = false }) => {
  const containerRef = useRef(null);
  const tagsRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 使用 ResizeObserver 監聽父容器尺寸變化
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // 如果高度太小（例如 min-height 尚未作用），給予保底高度
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
    if (!tags || tags.length === 0 || dimensions.width === 0 || !start) return;

    const { Engine, Runner, MouseConstraint, Mouse, Composite, Bodies, Events } = Matter;
    const { width, height } = dimensions;

    // 建立引擎
    const engine = Engine.create();
    const { world } = engine;

    // 建立掉落物體 (對應每個標籤)
    const tagBodies = tags.map((text, i) => {
      const bodyWidth = text.length * 18 + 30;
      const bodyHeight = 40;

      // 隨機在水平範圍內掉落
      const x = 50 + Math.random() * (width - 100);
      const y = -50 - i * 40;

      const body = Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
        chamfer: { radius: 20 },
        restitution: 0.5,
        friction: 0.1,
      });

      body.label = text;
      return body;
    });

    Composite.add(world, tagBodies);

    // 建立邊界 (動態對齊寬高)
    const wallThickness = 100;
    Composite.add(world, [
      Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, {
        isStatic: true,
      }), // 地板
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true,
      }), // 左牆
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true,
      }), // 右牆
    ]);

    // 建立運行器
    const runner = Runner.create();
    Runner.run(runner, engine);

    // 建立透明 Canvas 捕捉拖拽
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '10';
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
    });

    Events.on(mouseConstraint, 'mouseup', () => {
      const duration = Date.now() - startTime;
      if (duration < 200 && mouseConstraint.body && mouseConstraint.body.label) {
        window.location.hash = `#${mouseConstraint.body.label}`;
      }
    });

    // 每一幀更新 DOM 位置
    Events.on(engine, 'afterUpdate', () => {
      tagBodies.forEach((body, i) => {
        const el = tagsRef.current[i];
        if (el) {
          const { x, y } = body.position;
          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
        }
      });

      if (mouseConstraint.body) {
        canvas.style.cursor = 'grabbing';
      } else {
        const hoveredBody = Matter.Query.point(tagBodies, mouse.position)[0];
        canvas.style.cursor = hoveredBody ? 'pointer' : 'default';
      }
    });

    // 清理
    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(world);
      if (canvas) canvas.remove();
    };
  }, [tags, dimensions, start]);

  return (
    <div
      ref={containerRef}
      className="w-100 h-100 position-absolute top-0 start-0 overflow-hidden"
      style={{ minHeight: '350px' }}
    >
      {tags.map((tag, i) => (
        <a
          key={i}
          ref={(el) => (tagsRef.current[i] = el)}
          href={`#${tag}`}
          className="text-decoration-none round-pill btn btn-light py-8 h5 px-16 etfsTag border-gray-800 position-absolute"
          style={{
            left: '0',
            top: '0',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 5,
            transformOrigin: 'center center',
            fontSize: dimensions.width < 400 ? '14px' : '16px',
            visibility: dimensions.width === 0 ? 'hidden' : 'visible',
          }}
          onClick={(e) => e.preventDefault()}
        >
          {tag}
        </a>
      ))}
    </div>
  );
};

export default Mixed;
