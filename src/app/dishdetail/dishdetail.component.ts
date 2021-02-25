import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({ transform: 'scale(1.0)', opacity: 1 })),
      state('hidden', style({ transform: 'scale(0.5)', opacity: 0 })),
      transition('* => *', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishcopy: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;

  faLeft = faChevronLeft;
  faRight = faChevronRight;
  visibility = 'shown';

  newCommentForm: FormGroup;
  newComment: Comment;
  @ViewChild('cform') newCommentFormDirective;

  formErrors = {
    author: '',
    rating: '',
    comment: '',
  };

  validationMessages = {
    author: {
      required: 'Author name is required.',
      minlength: 'Author name must be at least 2 characters long.',
      maxlength: 'Author name cannot be more than 25 characters long',
    },
    rating: {
      required: 'Rating is required.',
    },
    comment: {
      required: 'Comment is required.',
    },
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = 'hidden';
          return this.dishService.getDish(params['id']);
        })
      )
      .subscribe(
        (dish) => {
          this.dish = dish;
          this.dishcopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
        },
        (errmess) => (this.errMess = <any>errmess)
      );
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.newCommentForm = this.fb.group({
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      rating: 5,
      comment: ['', Validators.required],
    });

    this.newCommentForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.newCommentForm) {
      return;
    }

    const form = this.newCommentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.newComment = this.newCommentForm.value;
    this.newComment.date = new Date().toISOString();
    // push new comment to dish's comments
    this.dishcopy.comments.push(this.newComment);
    this.dishService.putDish(this.dishcopy).subscribe(
      (dish) => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      (errmess) => {
        this.dish = null;
        this.dishcopy = null;
        this.errMess = <any>errmess;
      }
    );
    // reset form
    this.newCommentFormDirective.resetForm();
    this.newCommentForm.reset({
      author: '',
      rating: 5,
      comment: '',
    });
  }
}
