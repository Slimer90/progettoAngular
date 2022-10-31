import {ElementRef} from '@angular/core';

export const animateCSS = (element: ElementRef, animation: string, prefix: string = 'animate__') =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;

    element.nativeElement.classList.add(`${prefix}animated`, animationName);

    const handleAnimationEnd = (event) => {
      event.stopPropagation();
      element.nativeElement.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    };

    element.nativeElement.addEventListener('animationend', handleAnimationEnd, {once: true});
  });

