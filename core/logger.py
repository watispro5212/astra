import logging
import sys
from typing import Optional

def setup_logging(level: int = logging.INFO) -> logging.Logger:
    """Sets up a custom logger with a specific format."""
    logger = logging.getLogger("astra")
    logger.setLevel(level)

    # Console Handler
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)
    
    if not logger.handlers:
        logger.addHandler(handler)

    return logger

logger = setup_logging()
