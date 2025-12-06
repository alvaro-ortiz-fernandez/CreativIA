import { Injectable } from '@angular/core';
import {
  getFirestore, collection, addDoc, getDocs, getDoc,
  CollectionReference, DocumentData, DocumentReference, DocumentSnapshot
} from 'firebase/firestore';
import { forkJoin, from, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ColorPalette } from '../model/colors/ColorPalette';
import { Color } from '../model/colors/Color';
import { Concept } from '../model/colors/Concept';
import { ColorScheme } from '../model/colors/ColorScheme';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  private paletteRepository: PaletteRepository = new PaletteRepository();


  getColorPalettes(): Observable<ColorPalette[]> {
    return this.paletteRepository.findAll();
  }

  saveColorPalette(colorPalette: ColorPalette): Observable<ColorPalette> {
    return this.paletteRepository.create(colorPalette);
  }
}

export function decodeFireConfig(encoded: string, key = 24) {
  return atob(encoded)
    .split('')
    .map(c => String.fromCharCode(c.charCodeAt(0) ^ key))
    .join('');
}

abstract class FirebaseRepository<T extends { id?: string }> {

  protected readonly db = getFirestore();
  protected abstract collectionName: string;

  protected get collectionRef(): CollectionReference<DocumentData> {
    return collection(this.db, this.collectionName);
  }

  findAll(): Observable<T[]> {
    return from(getDocs(this.collectionRef)).pipe(
      mergeMap(snap => {
        return forkJoin(snap.docs.map(docSnap => this.build(docSnap.ref)));
      })
    );
  }

  create(entity: T): Observable<T> {
    const data = this.debuild(entity);
    return from(addDoc(this.collectionRef, data))
      .pipe(mergeMap(docRef => this.build(docRef)));
  }

  protected abstract build(docRef: DocumentReference): Observable<T>;

  protected abstract debuild(entity: T): DocumentData;
}

class PaletteRepository extends FirebaseRepository<ColorPalette> {

  protected collectionName = 'palettes';
  
  protected build(docRef: DocumentReference): Observable<ColorPalette> {
    return from(
      getDoc(docRef).then((docSnap: DocumentSnapshot) => {
        if (!docSnap.exists())
          return new ColorPalette();

        const data = docSnap.data();
        if (!data)
          return new ColorPalette();

        const id: string = docSnap.id;
        const baseColor: Color = this.toColor(data['baseColor']);
        const colors: Color[] = data['colors']?.map((c: DocumentData) => this.toColor(c));
        const scheme: ColorScheme = this.toColorScheme(data['scheme']);
        const concept: Concept = this.toConcept(data['concept']);
        const interpretation: string = data['interpretation'];
        
        return new ColorPalette(id, baseColor, colors, scheme, concept, interpretation);
      })
    );
  }

  protected debuild(entity: ColorPalette): DocumentData {
    return {
      baseColor: this.fromColor(entity.baseColor),
      colors: entity.colors.map(c => this.fromColor(c)),
      scheme: this.fromColorScheme(entity.scheme),
      concept: this.fromConcept(entity.concept),
      interpretation: entity.interpretation
    };
  }

  private toColor(docData?: DocumentData): Color {
    return new Color(
        docData?.['name'],
        docData?.['hex'],
        docData?.['r'],
        docData?.['g'],
        docData?.['b']
      );
  }

  private fromColor(color: Color): DocumentData {
    return {
      name: color.name,
      hex: color.hex,
      r: color.r,
      g: color.g,
      b: color.b
    };
  }

  private toColorScheme(docData?: DocumentData): ColorScheme {
    return new ColorScheme(
        docData?.['type'],
        docData?.['tones']
      );
  }

  private fromColorScheme(s: ColorScheme): DocumentData {
    return {
      type: s.type,
      tones: s.tones
    };
  }

  private toConcept(docData?: DocumentData): Concept {
    return new Concept(
        docData?.['context'],
        docData?.['suggestion']
      );
  }

  private fromConcept(c: Concept): DocumentData {
    return {
      context: c.context,
      suggestion: c.suggestion
    };
  }
}