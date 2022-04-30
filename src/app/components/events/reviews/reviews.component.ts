import { Component, OnInit } from '@angular/core';
import {ReviewService} from "../../../services/review.service";
import {ActivatedRoute} from "@angular/router";
import {EventLengthMark, Review} from "../../../entity/Event/Review";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  public reviews:Review[]=[];
  private lenMarks = Object.values(EventLengthMark);
  public lengthsMarks = new Map<string, string>();
  public imageIndex=0;
  public imageObj:any[]=[];
  public isShowFullImage=false;
  public imagesMap:Map<string,number>=new Map<string, number>();

  constructor(private reviewService:ReviewService,private currentRoute:ActivatedRoute) { }

  ngOnInit(): void {

    this.lengthsMarks = this.lengthsMarks.set(this.lenMarks[0],"Очень короткое");
    this.lengthsMarks = this.lengthsMarks.set( this.lenMarks[1],"Очень длинное");
    this.lengthsMarks = this.lengthsMarks.set( this.lenMarks[2],"То что надо");
    this.currentRoute.queryParams.subscribe(params=>{
      var login=params['login'];
      this.reviewService.getReviewsForUserEvents(login).subscribe(reviews=>{
        this.reviews=reviews;
      })
    })
  }

  closeEventHandler(){
    this.isShowFullImage=false;
    this.imageObj=[];
  }

  showImage(review:Review,url:string){
    this.imagesMap=new Map<string, number>();
    if (review.reviewImagesUrls) {
      for (let [index, image] of review.reviewImagesUrls.entries()) {
        this.imagesMap.set(image, index);
        this.imageObj.push({image: image, alt: 'message image'});
      }
      this.imageIndex = this.imagesMap.get(url) || 0;
      this.isShowFullImage = true;
    }
  }


}
