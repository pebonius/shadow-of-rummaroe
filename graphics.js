export const defaultFont = "Courier New";

export const drawText = (
  context,
  text,
  fontSize,
  color,
  posX,
  posY,
  font = defaultFont
) => {
  context.font = fontSize + "px " + font;
  context.fillStyle = color;
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(text, posX, posY);
};

export const setContextFont = (context, size) => {
  context.font = size + "px " + defaultFont;
};

export const drawRectangle = (context, position, size, color, fill = true) => {
  context.beginPath();
  if (fill) {
    context.fillStyle = color;
    context.fillRect(position.x, position.y, size.x, size.y);
  } else {
    context.strokeStyle = color;
    context.strokeRect(position.x, position.y, size.x, size.y);
  }
};

export const clearContext = (context, canvas) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000";
  context.fill();
};

export const drawImage = (context, image, position, size) => {
  context.drawImage(image, position.x, position.y, size.x, size.y);
};

export const drawSpriteAtPos = (
  context,
  spriteSheet,
  spriteId,
  position,
  flippedX = false,
  flippedY = false
) => {
  context.save();
  context.transform(
    flippedX ? -1 : 1,
    0,
    0,
    flippedY ? -1 : 1,
    position.x + (flippedX ? spriteSheet.tileSize : 0),
    position.y + (flippedY ? spriteSheet.tileSize : 0)
  );
  context.drawImage(
    spriteSheet.image,
    spriteSheet.tileToCol(spriteId) * spriteSheet.tileSize,
    spriteSheet.tileToRow(spriteId) * spriteSheet.tileSize,
    spriteSheet.tileSize,
    spriteSheet.tileSize,
    0,
    0,
    spriteSheet.tileSize,
    spriteSheet.tileSize
  );
  context.restore();
};
