package com.dh.canchas365.service;

import com.dh.canchas365.dto.*;
import com.dh.canchas365.dto.images.ImageDTO;
import com.dh.canchas365.exceptions.ResourceDuplicateException;
import com.dh.canchas365.model.*;
import com.dh.canchas365.model.images.Images;
import com.dh.canchas365.model.location.Address;
import com.dh.canchas365.repository.ClubRepository;
import com.dh.canchas365.repository.ReservationRepository;
import com.dh.canchas365.repository.images.ImagesRepository;
import com.dh.canchas365.repository.location.AddressRepository;
import com.dh.canchas365.service.location.AdressService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AdressService adressService;

    @Autowired
    private ImagesRepository imagesRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CharacteristicService characteristicService;

    @Autowired
    private PlayingFieldService playingFieldService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Transactional
    public Club createClub(ClubCreateDTO dto) throws ResourceDuplicateException {
        var characteristicsList = new ArrayList<Characteristic>();

        Club clubToSave = new Club();
        clubToSave.setName(dto.getName());
        clubToSave.setPhone_number(dto.getPhone_number());
        clubToSave.setRecommended(dto.getRecommended());

        Optional<Club> optionalClub = clubRepository.findByName(dto.getName());
        if(optionalClub.isPresent()){
            throw new ResourceDuplicateException("El nombre del Club ya está en uso");
        }

        Optional<Address> optionalAddress = addressRepository.findByAddress(dto.getAddress().getStreet(), dto.getAddress().getNumber(), dto.getAddress().getCity().getId());
        if(optionalAddress.isPresent()){
            clubToSave.setAddress(optionalAddress.get());
        }
        else{
            Address addressSaved = adressService.createAddress(dto.getAddress());
            clubToSave.setAddress(addressSaved);
        }

        Optional<Category> optionalCategory = categoryService.findById(dto.getCategory().getId());
        if(optionalCategory.isEmpty()) {
            try {
                throw new Exception("El id Category no existe");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        for(CharacteristicDto characteristic: dto.getCharacteristics()) {
            var optional = characteristicService.findById(characteristic.getId()).orElse(null);
            if(optional == null) {
                try {
                    throw new Exception("El Id de caracteristica no existe");
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
            characteristicsList.add(optional);
        }

        clubToSave.setCategory(optionalCategory.get());
        clubToSave.setCharacteristics(characteristicsList);

        Club clubSaved = clubRepository.save(clubToSave);

        List<Images> imagesTosave = new ArrayList<>();
        for(ImageDTO imgDto: dto.getImages()){
            Images imageToSave = new Images();
            imageToSave.setUrl(imgDto.getUrl());
            imageToSave.setClub(clubSaved);
            imagesTosave.add(imageToSave);
        }

        imagesRepository.saveAll(imagesTosave);

        return clubSaved;
    }
    @Transactional
    public ClubDTO updateClub(Club club){

        var characteristicsList = new ArrayList<Characteristic>();

        Category category = categoryService.findById(club.getCategory().getId()).orElse(null);
        club.setCategory(category);
        for(Characteristic characteristic : club.getCharacteristics()) {
            var item = characteristicService.findById(characteristic.getId()).orElse(null);
            characteristicsList.add(item);
        }
        club.setCharacteristics(characteristicsList);

        Club clubSaved = clubRepository.save(club);
        ModelMapper mapper = new ModelMapper();
        ClubDTO clubDTO = mapper.map(clubSaved, ClubDTO.class);
        clubDTO.setCharacteristics(new HashSet<>());
        for (Characteristic characteristic : club.getCharacteristics()) {
            clubDTO.getCharacteristics().add(mapper.map(characteristic, CharacteristicDto.class));
        }

        return clubDTO;
    }

    public List<ClubDTO> getAllClubs(){
        List<Club> clubes =clubRepository.findAll();
        ModelMapper mapper = new ModelMapper();
        List<ClubDTO> clubesDTO = new ArrayList<>();

        for (Club club : clubes) {
            ClubDTO clubDTO = mapper.map(club, ClubDTO.class);
            clubDTO.setCharacteristics(new HashSet<>());

            for (Characteristic characteristic : club.getCharacteristics()) {
                clubDTO.getCharacteristics().add(mapper.map(characteristic, CharacteristicDto.class));
            }

            clubesDTO.add(clubDTO);
        }

        return clubesDTO;
    }

    public void deleteClub(Long id){
        clubRepository.deleteById(id);
    }

    public ClubDTO findById(Long id){
        Club club = clubRepository.findById(id).orElse(null);

        if(club != null) {
            ModelMapper mapper = new ModelMapper();

            ClubDTO clubDTO = mapper.map(club, ClubDTO.class);
            clubDTO = mapper.map(club, ClubDTO.class);
            return clubDTO;
        } else {
            return null;
        }
    }

    public List<ClubDTO> getClubsRecommended(){
        List<Club> clubes =clubRepository.getClubRecommended();
        ModelMapper mapper = new ModelMapper();
        List<ClubDTO> clubesDTO = new ArrayList<ClubDTO>();
        for(Club club: clubes){
            clubesDTO.add(mapper.map(club, ClubDTO.class));
        }
        return clubesDTO;
    }

    public List<ClubDTO> getRandomClubs(){
        List<Club> clubes =clubRepository.getRandomClubs();
        ModelMapper mapper = new ModelMapper();
        List<ClubDTO> clubesDTO = new ArrayList<ClubDTO>();
        for(Club club: clubes){
            clubesDTO.add(mapper.map(club, ClubDTO.class));
        }
        return clubesDTO;
    }

    public List<ClubDTO> getByCategories(List<Category> categories) {
        List<Club> clubList =clubRepository.findAll();
        ModelMapper mapper = new ModelMapper();
        List<ClubDTO> clubesDTO = new ArrayList<>();

        List<Long> categoryIds = categories.stream()
                .map(Category::getId)
                .collect(Collectors.toList());

        List<Club> filteredClubs = clubList.stream()
                .filter(club -> categoryIds.contains(club.getCategory().getId()))
                .collect(Collectors.toList());

        for (Club club : filteredClubs) {
            ClubDTO clubDTO = mapper.map(club, ClubDTO.class);
            clubDTO.setCharacteristics(new HashSet<>());

            for (Characteristic characteristic : club.getCharacteristics()) {
                clubDTO.getCharacteristics().add(mapper.map(characteristic, CharacteristicDto.class));
            }

            clubesDTO.add(clubDTO);
        }

        return clubesDTO;
    }

    public List<ClubDTO> search(SearchDto filters) {
        ModelMapper mapper = new ModelMapper();
        List<ClubDTO> clubesDTO = new ArrayList<>();
        List<PlayingField> playingFieldsList = new ArrayList<>();

        List<Club> clubSearch = clubRepository.clubSearch(filters.getCategory().getId(), filters.getCity().getId()).orElse(null);
        List<Reservation> reservationAll = reservationRepository.findAll();

        for (Reservation reservation : reservationAll) {
            if (filters.getDatetime().isEqual(reservation.getStartDatetime()) ||
                    (filters.getDatetime().isAfter(reservation.getStartDatetime()) && filters.getDatetime().isBefore(reservation.getEndDatetime()))) {
                playingFieldsList.add(reservation.getPlayingField());
            }
        }

        if (clubSearch != null) {
            for (Club club : clubSearch) {
                Iterator<PlayingField> iterator = playingFieldsList.iterator();
                while (iterator.hasNext()) {
                    PlayingField playingField = iterator.next();
                    if (playingField.getClub().equals(club)) {
                        iterator.remove();
                    }
                }
            }

            for (Club club : clubSearch) {
                ClubDTO clubDTO = mapper.map(club, ClubDTO.class);
                List<PlayingFieldDTO> playingFieldsDTO = playingFieldService.getPlayingFieldByClub(club.getId());
                clubDTO.setPlayingFields(playingFieldsDTO);
                clubesDTO.add(clubDTO);
            }
        }

        return clubesDTO;
    }
}
