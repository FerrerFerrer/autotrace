import {
    Component,
    OnInit,
    Renderer2,
    OnDestroy,
    HostBinding
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AppService} from '@services/app.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'register-box';

    public registerForm: FormGroup;
    public isAuthLoading = false;
    public isGoogleLoading = false;
    public isFacebookLoading = false;

    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService
    ) {}

    ngOnInit() {
        // this.renderer.addClass(
        //     document.querySelector('app-root'),
        //     'register-page'
        // );
        // this.registerForm = new FormGroup({
        //     email: new FormControl(null, Validators.required),
        //     password: new FormControl(null, [Validators.required]),
        //     retypePassword: new FormControl(null, [Validators.required])
        // });
    }

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'register-page'
        );
    }
}
