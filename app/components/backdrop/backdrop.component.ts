import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {DynamicHelperService} from '../../services/dynamic-helper.service';
import {DynamicComponent} from '../../model/class/dynamic-component';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.css']
})
export class BackdropComponent implements OnInit, OnDestroy {

  @ViewChild('backdrop') backdrop: ElementRef<HTMLDivElement>;

  __subscription: Subscription;

  constructor(private cd: ChangeDetectorRef,
              private dynamicFormService: DynamicHelperService) {
  }

  ngOnInit(): void {
    this.__subscription = this.dynamicFormService.component
      .subscribe((dynamicForm: DynamicComponent) => {
        const backdropNative = this.backdrop?.nativeElement;

        if (dynamicForm != null) {
          if (dynamicForm.getShowModal()) {
            backdropNative.classList.add('animate__fadeIn');
            backdropNative.style.display = 'block';
          } else {
            backdropNative.style.display = 'block';
            backdropNative.classList.add('animate__fadeOut');
            setTimeout(() => {
              backdropNative.classList.remove('animate__fadeOut');
              backdropNative.style.display = 'none';
              this.dynamicFormService.clear();
            }, 1000);
          }
        }
        this.cd.markForCheck();
      });
  }

  closeModal() {
    this.dynamicFormService.toggleModal();
  }

  ngOnDestroy(): void {
    this.__subscription.unsubscribe();
  }

}
